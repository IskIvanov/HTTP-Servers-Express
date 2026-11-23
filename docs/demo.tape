# Chirpy API demo, rendered with VHS (https://github.com/charmbracelet/vhs)
#
# 1. Start the server:   bun run dev
# 2. Record the demo:    vhs docs/demo.tape
#
# Output: docs/demo.gif

Output docs/demo.gif

Require curl
Require jq
Require psql

Set Shell "bash"
Set FontSize 22
Set Width 1720
Set Height 520
Set Padding 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 55ms

# Hidden setup: remove the demo user from a previous recording (its chirps cascade) so sign-up works every time
Hide
Type `set -a && source .env && set +a && psql -q "$DB_URL" -c "DELETE FROM users WHERE email = 'demo@chirpy.dev'" >/dev/null && export PS1='\[\e[1;35m\]$ \[\e[0m\]' && clear` Enter
Sleep 1s
Show

# --- Intro ---------------------------------------------------------------
Type "# Chirpy: a tiny Twitter-like REST API" Enter
Sleep 1.5s
Type "# Express 5 + PostgreSQL + Drizzle ORM" Enter
Sleep 2s
Type "# 1) Is the server up?" Enter
Sleep 1s
Type `curl -s -w '\n' localhost:8080/api/healthz` Enter
Sleep 3s

# --- Sign up -------------------------------------------------------------
Ctrl+L
Type "# 2) Sign up. The password is hashed with Argon2 and never sent back" Enter
Sleep 1.5s
Type `curl -s --json '{"email":"demo@chirpy.dev","password":"hunter2"}' localhost:8080/api/users | jq` Enter
Sleep 5s

# --- Log in --------------------------------------------------------------
Ctrl+L
Type "# 3) Log in with the wrong password -> 401" Enter
Sleep 1.5s
Type `curl -s -w '  -> %{http_code}\n' --json '{"email":"demo@chirpy.dev","password":"oops"}' localhost:8080/api/login` Enter
Sleep 4s
Type "# 4) Log in with the right password and keep the user id" Enter
Sleep 1.5s
Type `USER_ID=$(curl -s --json '{"email":"demo@chirpy.dev","password":"hunter2"}' localhost:8080/api/login | jq -r .id)` Enter
Sleep 1s
Type `echo $USER_ID` Enter
Sleep 4s

# --- Chirps --------------------------------------------------------------
Ctrl+L
Type "# 5) Post a chirp. Banned words like 'kerfuffle' get censored" Enter
Sleep 1.5s
Type `curl -s --json '{"userId":"'$USER_ID'","body":"What a kerfuffle this Monday is"}' localhost:8080/api/chirps | jq` Enter
Sleep 6s

Ctrl+L
Type "# 6) Chirps longer than 140 characters are rejected -> 400" Enter
Sleep 1.5s
Type `LONG=$(printf 'a%.0s' {1..150})` Enter
Sleep 500ms
Type `curl -s -w '  -> %{http_code}\n' --json '{"userId":"'$USER_ID'","body":"'$LONG'"}' localhost:8080/api/chirps` Enter
Sleep 4s

Ctrl+L
Type "# 7) List the latest chirps" Enter
Sleep 1.5s
Type `curl -s localhost:8080/api/chirps | jq '.[-2:] | map({body, userId})'` Enter
Sleep 7s
