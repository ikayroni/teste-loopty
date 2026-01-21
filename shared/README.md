# Shared Types and Utilities

Este diretório contém código compartilhado entre backend e frontend (opcional).

## Estrutura

```
shared/
├── types/           # Tipos TypeScript compartilhados
├── validators/      # Validadores compartilhados
└── utils/          # Utilitários compartilhados
```

## Uso

### No Backend

```typescript
import { TaskStatus } from '../shared/types';
```

### No Frontend

```typescript
import { TaskStatus } from '../shared/types';
```

## Nota

Atualmente, os tipos estão duplicados entre backend e frontend para manter a independência dos projetos. Em um monorepo mais complexo, este diretório seria usado para centralizar tipos comuns.
