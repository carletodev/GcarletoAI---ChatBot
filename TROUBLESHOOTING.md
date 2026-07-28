# Troubleshooting — Setup do Chatbot (Next.js/Vite + Supabase + N8N)

Histórico dos erros enfrentados na configuração inicial do banco de dados (Supabase) e da integração com a IA (N8N), suas causas e como cada um foi resolvido.

---

## 1. `PGRST205` — Tabela `messages` não encontrada

```
Could not find the table 'public.messages' in the schema cache
```

**Causa:** a migration que cria a tabela `messages` existia no repositório, mas nunca tinha sido aplicada no banco remoto do Supabase.

**Solução:**
```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```
Depois do push, reiniciar o cache do PostgREST em **Settings → General → Restart project** no painel do Supabase.

> Como o projeto não usa Docker localmente (só `npm run dev`), comandos como `supabase status`, `supabase stop` e `supabase start` não se aplicam — o reinício do schema cache é feito pelo painel, não pela CLI.

---

## 2. `42P01` — Relação `chats` não existe

```
relation "public.chats" does not exist (SQLSTATE 42P01)
```

**Causa:** a tabela `messages` tem uma foreign key para `chats` (`chat_id references public.chats(id)`), mas a migration que cria `chats` nunca tinha sido escrita. A ordem de aplicação das migrations no Supabase segue o timestamp do nome do arquivo.

**Solução:** criada a migration `create_chats.sql` com timestamp anterior ao de `messages`, contendo a tabela `chats` e políticas de RLS (select/insert/update/delete restritos ao próprio usuário).

---

## 3. `42501` — Permissão negada na tabela `chats`

```
permission denied for table chats
```

**Causa:** as políticas de RLS foram criadas, mas faltou o `GRANT` básico — RLS controla quais *linhas* um papel pode acessar, mas o papel `authenticated` também precisa de permissão explícita para tocar na tabela.

**Solução:**
```sql
grant select, insert, update, delete on public.chats to authenticated;
grant select, insert, update, delete on public.messages to authenticated;
```

---

## 4. `PGRST205` — Tabela `profiles` não encontrada

```
Could not find the table 'public.profiles' in the schema cache
```

**Causa:** a tabela `profiles`, usada pelo `AuthContext.tsx` para guardar dados do usuário, nunca tinha sido criada em nenhuma migration.

**Solução:** criada a migration `create_profiles.sql`:
```sql
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;
```

---

## 5. `PGRST204` — Colunas com nomes divergentes

```
Could not find the 'full_name' column of 'profiles' in the schema cache
Could not find the 'titulo' column of 'chats' in the schema cache
```

**Causa:** descompasso entre os nomes de coluna usados no código do frontend e os nomes definidos nas migrations (`name` vs `full_name`, `title` vs `titulo`).

**Solução:**
```sql
alter table public.profiles rename column name to full_name;
alter table public.chats rename column title to titulo;
```

---

## 6. `42P01` — Projeto Supabase errado

```
ERROR: 42P01: relation "public.profiles" does not exist
```
(mesmo com a tabela já criada com sucesso)

**Causa:** o SQL Editor estava aberto em um projeto Supabase diferente daquele que a CLI linkou via `supabase link` (conta com mais de um projeto).

**Solução:** confirmar que o Reference ID bate entre as duas fontes:
```bash
type supabase\.temp\project-ref
```
E no painel: **Settings → General → Reference ID**. Repetir os comandos SQL no projeto correto. Uma query útil para checar rapidamente o que existe no schema:
```sql
select table_name from information_schema.tables where table_schema = 'public';
```

---

## 7. `22P02` — UUID inválido (`demo-chat-xxxxxxx`)

```
invalid input syntax for type uuid: "demo-chat-xxxxxxx"
```

**Causa:** um `chat_id` fixo (placeholder/demonstração) no código do frontend, usado como string comum, mas a coluna `chat_id` no banco é do tipo `uuid` (formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

**Solução:** corrigido no código, substituindo o ID fixo por um UUID real gerado pelo Supabase ao criar um chat.

---

## 8. CORS bloqueando chamada ao webhook do N8N

```
Access to fetch at 'https://SEU_DOMINIO.app.n8n.cloud/webhook/ai-assistant'
from origin 'http://localhost:5173' has been blocked by CORS policy:
Response to preflight request doesn't pass access control check:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Causa:** o frontend (`localhost:5173`) chamando o webhook do N8N diretamente do navegador; o N8N não estava configurado para liberar requisições de outras origens.

**Solução:** configurado o header CORS no nó **Webhook** do N8N:
```
Access-Control-Allow-Origin: *
```
(ou restrito a `http://localhost:5173` em desenvolvimento).

> Alternativa mais robusta para produção: rotear a chamada ao N8N por um backend/Edge Function em vez de direto do navegador, eliminando o problema de CORS e escondendo a URL do webhook.

---

## 9. Resposta vazia do webhook N8N

```
Failed to fetch N8N webhook: SyntaxError: Failed to execute 'json' on 'Response':
Unexpected end of JSON input
```

**Causa:** o workflow do N8N processava a requisição mas não devolvia nenhum corpo de resposta.

**Verificação feita:**
- Histórico de **Executions** no N8N, conferindo se o fluxo terminava com sucesso
- Nó **Webhook** configurado como **"Using 'Respond to Webhook' Node"** (em vez de "Immediately")
- Presença de um nó **Respond to Webhook** conectado ao final do fluxo, retornando JSON válido

**Solução:** ajuste do workflow no N8N para garantir resposta estruturada ao final da execução.

---

## 10. Lentidão na resposta da IA (pendente de otimização)

**Sintoma:** a IA (GPT-OSS via N8N) demora para responder.

**Possíveis causas identificadas:**
- Onde o modelo GPT-OSS está rodando (local/VPS com pouca capacidade vs GPU)
- Ausência de streaming — o frontend só recebe a resposta depois que o fluxo inteiro termina
- Etapas extras no workflow do N8N somando tempo de processamento

**Próximos passos sugeridos:**
- Conferir tempo de execução de cada nó no histórico do N8N (**Executions**)
- Avaliar se o modelo está rodando com aceleração de GPU
- Considerar implementar streaming (SSE/WebSockets) para melhorar a percepção de velocidade

---

## Ferramentas usadas no troubleshooting
- **Supabase CLI** — login, link do projeto, push de migrations
- **SQL Editor** (painel Supabase) — grants, renomeação de colunas, verificação de tabelas
- **N8N** (painel + Executions) — configuração de CORS e diagnóstico do webhook
- **Google Antigravity** — correção do bug de `chat_id` fixo no frontend
