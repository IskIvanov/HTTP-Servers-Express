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
Set FontSize 26
Set Width 1900
Set Height 760
Set Padding 24
Set Theme "Catppuccin Mocha"
Set TypingSpeed 55ms

# Hidden setup:
# - remove the demo user from a previous recording (its chirps cascade) so sign-up works every time
#   (psql gets DB_URL without its query string: libpq rejects client_min_messages)
# - API / CODE keep the visible curl commands short; CODE prints the HTTP status after the body
# - PS1 / PS2 style the prompt and the "> " continuation lines of heredocs
Hide
Type `set -a && source .env && set +a && psql -q "${DB_URL%%\?*}" -c "DELETE FROM users WHERE email = 'demo@chirpy.dev'" >/dev/null` Enter
Type `API=localhost:8080/api && CODE='  -> %{http_code}\n'` Enter
Type `export PS1='\[\e[1;35m\]$ \[\e[0m\]' PS2='\[\e[1;35m\]> \[\e[0m\]' && clear` Enter
Sleep 1s
Show

# --- Intro ---------------------------------------------------------------
Type "# Chirpy: a tiny Twitter-like REST API" Enter
Sleep 1.5s
Type "# Express 5 + PostgreSQL + Drizzle ORM" Enter
Sleep 2s
Type "# 1) Is the server up?" Enter
Sleep 1s
Type `curl -s -w "$CODE" $API/healthz` Enter
Sleep 3s

# --- Sign up -------------------------------------------------------------
Ctrl+L
Type "# 2) Sign up. The password is hashed with Argon2 and never sent back" Enter
Sleep 1.5s
Type `curl -s $API/users --json '{ "email": "demo@chirpy.dev", "password": "hunter2" }' | jq` Enter
Sleep 5s

# --- Log in --------------------------------------------------------------
Ctrl+L
Type "# 3) Log in with the wrong password -> 401" Enter
Sleep 1.5s
Type `curl -s -w "$CODE" $API/login --json '{ "email": "demo@chirpy.dev", "password": "oops" }'` Enter
Sleep 4s
Type "# 4) Log in with the right password and keep the user id" Enter
Sleep 1.5s
Type `USER_ID=$(curl -s $API/login --json '{ "email": "demo@chirpy.dev", "password": "hunter2" }' | jq -r .id)` Enter
Sleep 1s
Type `echo $USER_ID` Enter
Sleep 4s

# --- Chirps --------------------------------------------------------------
Ctrl+L
Type "# 5) Post a chirp. Banned words like 'kerfuffle' get censored" Enter
Sleep 1.5s
Type `curl -s $API/chirps --json @- <<EOF | jq` Enter
Type `{` Enter
Type `  "userId": "$USER_ID",` Enter
Type `  "body": "What a kerfuffle this Monday is"` Enter
Type `}` Enter
Type `EOF` Enter
Sleep 6s

Ctrl+L
Type "# 6) Chirps longer than 140 characters are rejected -> 400" Enter
Sleep 1.5s
Type `LONG=$(printf 'a%.0s' {1..150})` Enter
Sleep 500ms
Type `curl -s -w "$CODE" $API/chirps --json @- <<EOF` Enter
Type `{ "userId": "$USER_ID", "body": "$LONG" }` Enter
Type `EOF` Enter
Sleep 4s

Ctrl+L
Type "# 7) List the latest chirps" Enter
Sleep 1.5s
Type `curl -s $API/chirps | jq '.[-2:] | map({ body, userId })'` Enter
Sleep 7s

# --- Polka webhooks ------------------------------------------------------
Ctrl+L
Type "# 8) Polka webhook: events we don't handle are acknowledged -> 204" Enter
Sleep 1.5s
Type `curl -s -w "$CODE" $API/polka/webhooks --json @- <<EOF` Enter
Type `{` Enter
Type `  "event": "user.payment_failed",` Enter
Type `  "data": { "userId": "$USER_ID" }` Enter
Type `}` Enter
Type `EOF` Enter
Sleep 4s
Type "# 9) Upgrading an unknown user -> 404" Enter
Sleep 1.5s
Type `curl -s -w "$CODE" $API/polka/webhooks --json @- <<EOF` Enter
Type `{` Enter
Type `  "event": "user.upgraded",` Enter
Type `  "data": { "userId": "00000000-0000-0000-0000-000000000000" }` Enter
Type `}` Enter
Type `EOF` Enter
Sleep 4s

Ctrl+L
Type "# 10) user.upgraded grants Chirpy Red -> 204" Enter
Sleep 1.5s
Type `curl -s -w "$CODE" $API/polka/webhooks --json @- <<EOF` Enter
Type `{` Enter
Type `  "event": "user.upgraded",` Enter
Type `  "data": { "userId": "$USER_ID" }` Enter
Type `}` Enter
Type `EOF` Enter
Sleep 4s

Ctrl+L
Type "# 11) Log in again: the user is now Chirpy Red" Enter
Sleep 1.5s
Type `curl -s $API/login --json '{ "email": "demo@chirpy.dev", "password": "hunter2" }' | jq '{ email, isChirpyRed }'` Enter
Sleep 6s
