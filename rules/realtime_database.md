# Bloqueado
{
  "rules": {
    ".read": false,
    ".write": false
  }
}

# Testes
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

# Usuários autenticados
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}

# Acesso restrito ao dono dos dados
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid",
    		".write": "auth.uid == $uid",
        ".indexOn": "nameToLowerCase",
      }
    }
  }
}