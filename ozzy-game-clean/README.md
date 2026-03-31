# 🎸 Ozzy Game - Clean Code Version

Versão refatorada do jogo Ozzy Mario aplicando boas práticas de Clean Code e arquitetura modular.

## 📁 Estrutura do Projeto

```
ozzy-game-clean/
├── index.html              # HTML limpo (sem CSS/JS inline)
├── src/
│   ├── css/
│   │   └── styles.css      # Estilos separados e organizados
│   ├── js/
│   │   ├── main.js         # Entry point da aplicação
│   │   ├── Game.js         # Classe principal que orquestra o jogo
│   │   ├── core/
│   │   │   ├── config.js           # Configurações globais centralizadas
│   │   │   ├── CollisionHandler.js # Gerenciador de colisões
│   │   │   └── LevelManager.js     # Gerenciador de níveis
│   │   ├── entities/
│   │   │   ├── Player.js       # Entidade do jogador
│   │   │   ├── Enemy.js        # Entidade de inimigos
│   │   │   ├── Platform.js     # Entidade de plataformas
│   │   │   ├── Coin.js         # Entidade de moedas
│   │   │   ├── Flag.js         # Entidade da bandeira
│   │   │   └── Boss.js         # Entidade do boss
│   │   └── input/
│   │       └── InputHandler.js # Gerenciador de inputs
│   └── assets/             # (futuros assets)
└── README.md
```

## ✨ Boas Práticas Aplicadas

### 1. **Separação de Responsabilidades (SRP)**
- Cada classe tem uma única responsabilidade bem definida
- CSS separado em arquivo próprio
- JavaScript modularizado em ES6 Modules

### 2. **Classes Especializadas**
| Classe | Responsabilidade |
|--------|------------------|
| `Game` | Orquestrar entidades e game loop |
| `Player` | Física, movimento e renderização do jogador |
| `Enemy` | Comportamento de inimigos (spider/bat) |
| `Boss` | Lógica do chefe de fase |
| `CollisionHandler` | Detecção e resolução de colisões |
| `LevelManager` | Dados e carregamento de níveis |
| `InputHandler` | Gerenciamento de teclado e touch |

### 3. **Configuração Centralizada**
```javascript
// src/js/core/config.js
const CONFIG = {
    PLAYER: { SPEED: 5, JUMP_FORCE: -15, ... },
    ENEMY: { SPIDER: {...}, BAT: {...} },
    SCORING: { COIN_VALUE: 10, ... },
    // ... todas as constantes em um lugar
};
```

### 4. **Funções Pequenas e Legíveis**
- Métodos com nomes descritivos
- Funções com menos de 20 linhas quando possível
- Extração de lógica complexa para métodos privados

### 5. **Sem Inline Handlers**
```html
<!-- Antes -->
<button onclick="startGame()">JOGAR</button>

<!-- Depois -->
<button class="btn-primary">JOGAR</button>
<!-- Event listener configurado via JS -->
```

### 6. **Documentação JSDoc**
```javascript
/**
 * Processa colisões do jogador com plataformas
 * @param {Player} player 
 * @param {Platform[]} platforms 
 */
handlePlatformCollisions(player, platforms) { ... }
```

### 7. **Organização por Pastas**
- `core/`: Lógica central do jogo
- `entities/`: Classes de entidades renderizáveis
- `input/`: Gerenciamento de entrada
- `utils/`: Funções utilitárias (futuro)

### 8. **CSS Organizado**
- Comentários de seção claros
- Agrupamento lógico (reset, base, componentes, responsivo)
- Classes semânticas e reutilizáveis

## 🚀 Como Executar

1. Abra o arquivo `index.html` em um navegador moderno
2. Ou use um servidor local:
```bash
# Com Python
cd ozzy-game-clean
python -m http.server 8000

# Com Node.js (npx)
npx serve ozzy-game-clean
```

## 🎮 Controles

- **Teclado**: Setas ou WASD
- **Mobile**: Botões touch na tela

## 📊 Comparação: Antes vs Depois

| Aspecto | Original | Refatorado |
|---------|----------|------------|
| Arquivos | 1 (1310 linhas) | 12+ arquivos |
| CSS | Inline no HTML | Separado |
| JS | Script monolítico | Módulos ES6 |
| Classes | 4 misturadas | 9 especializadas |
| Funções | Longas (>100 linhas) | Curtas (<30 linhas) |
| Configs | Hardcoded | Centralizadas |
| Handlers | Inline | addEventListener |

## 🔧 Extensibilidade

Adicionar novos elementos agora é mais fácil:

```javascript
// Nova entidade
import Entity from './entities/Entity.js';

class PowerUp extends Entity {
    constructor(x, y, type) {
        super(x, y);
        this.type = type;
    }
    // ... implementação
}
```

## 📝 Princípios SOLID Aplicados

- **S**ingle Responsibility: Cada classe faz uma coisa
- **O**pen/Closed: Entidades abertas para extensão
- **L**iskov Substitution: Entidades intercambiáveis
- **I**nterface Segregation: Interfaces mínimas
- **D**ependency Injection: Injeção via construtor

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push (`git push origin feature/nova-feature`)
5. Pull Request

---

**Desenvolvido com ❤️ aplicando Clean Code**
