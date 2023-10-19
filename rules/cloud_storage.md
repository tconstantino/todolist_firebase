# Padrão - Para usuários autenticados:
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}

# Testes:
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: true;
    }
  }
}

# Bloqueado:
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: false;
    }
  }
}

# Acesso restrito ao dono dos arquivos e limite de tamanho de arquivo
rules_version = '2';

// Craft rules based on data in your Firestore database
// allow write: if firestore.get(
//    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
service firebase.storage {
  match /b/{bucket}/o {
    match /todoListFiles/{uid}/{allPaths=**} {
      allow write: if request.auth.uid == uid
        && request.resource.size < 1024 * 1024 * 10
        && request.resource.contentType.matches('image/.*');
      allow read: if request.auth.uid == uid;
      allow delete: if request.auth.uid == uid
    }
  }
}