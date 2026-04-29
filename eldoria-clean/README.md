# ⚔️ Eldoria — Legends of Eldoria

> *Um RPG de ação 3D rodando direto no navegador, sem engine, sem framework — só JavaScript puro e Three.js.*

---

## Sobre o jogo

Eldoria é um RPG de ação em perspectiva isométrica onde você cria um herói, explora mundos que mudam conforme você sobe de nível, derrota monstros, coleta itens e evolui suas habilidades.

Tudo acontece em tempo real, com sistema de combate baseado em cooldowns, loot procedural, quests, conquistas e um sistema de save automático. O jogo roda inteiramente no browser — sem servidor, sem build step, sem dependências externas além do Three.js carregado via CDN.

---

## Gameplay

| Ação | Teclado |
|---|---|
| Mover | `WASD` ou `↑ ↓ ← →` |
| Atacar | `Espaço` |
| Fireball | `Z` |
| AOE | `X` |
| Dash | `C` |
| Escudo | `F` |
| Inventário | `V` / `I` |
| Loja | `B` |
| Árvore de Skills | `N` |
| Mapa completo | `M` |
| Pausar | `P` / `Esc` |

Suporte a **joystick virtual** em mobile — controle flutuante com botões de habilidade sobrepostos na tela.

---

## Mundo & Biomas

O mapa muda automaticamente conforme o nível do herói. São **10 biomas** progressivos, cada um com paleta de cores, névoa e conjunto de monstros próprios:

| Nível | Bioma |
|---|---|
| 1 | Green Plains |
| 5 | Dark Forest |
| 10 | Golden Desert |
| 15 | Frozen Snow |
| 20 | Volcanic Lands |
| 30 | Mystic Highlands |
| 45 | Crystal Caves |
| 60 | Shadow Realm |
| 80 | Celestial Peaks |
| 100 | Eternal Void |

Cada bioma tem seu próprio set de inimigos — de Slimes e Wolves até Void Abominations e Abyss Lords.

---

## Sistemas do jogo

- **Combate** — ataque básico, fireball com projétil 3D, AOE circular, dash e escudo com cooldowns e custo de SP
- **Loot** — drop procedural por nível com raridades (Common → Legendary)
- **Inventário & Equipamento** — weapon, shield, cape, boots, ring ×2
- **Loja** — catálogo estático de itens com preço e requisito de nível
- **Progressão** — XP, level up, skill points, árvore de habilidades passivas e ativas
- **Quests** — objetivos por tipo de monstro e coleta de itens
- **Conquistas** — desbloqueadas por marcos de kills, biomas visitados, entre outros
- **Save automático** — localStorage a cada 30 segundos, múltiplos slots por herói

---

## Arquitetura — Clean Architecture

O projeto foi refatorado para seguir princípios de **separação de responsabilidades** e **single responsibility por módulo**. Cada pasta agrupa sistemas coesos:

```
eldoria-clean/
├── index.html                  # Shell HTML — só estrutura e imports CSS
└── src/
    ├── css/
    │   ├── main.css            # Reset e base global
    │   ├── hud.css             # HUD e barras
    │   ├── ui.css              # Modais, menus, inventário
    │   ├── mobile.css          # Layout responsivo e joystick
    │   └── effects.css         # Animações e efeitos visuais
    └── js/
        ├── main.js             # Entry point — só dispara boot()
        ├── EldoriaApp.js       # Orquestrador — inicializa sistemas na ordem correta
        ├── core/
        │   ├── Config.js       # Constantes e dados estáticos (imutável)
        │   ├── GameState.js    # Singleton de estado mutável
        │   ├── GameLoop.js     # requestAnimationFrame + deltaTime
        │   ├── EventBus.js     # Observer para comunicação desacoplada
        │   ├── AudioManager.js # Sons e música
        │   ├── SaveSystem.js   # Persistência via localStorage
        │   └── Logger.js       # Log de combate na UI
        ├── graphics/
        │   ├── SceneManager.js # Setup Three.js: cena, câmera, renderer, luz
        │   ├── ModelLoader.js  # Construção procedural do herói 3D
        │   └── VisualEffects.js# Floating text, screen shake, partículas
        ├── input/
        │   ├── InputHandler.js # Teclado — vetor de movimento normalizado
        │   └── Joystick.js     # Touch joystick para mobile
        ├── ui/
        │   ├── HUD.js          # Barras HP/SP/XP e cooldowns
        │   ├── UIManager.js    # Menus: inventário, loja, evolução, pausa
        │   └── Minimap.js      # Minimap e mapa expandido
        ├── combat/
        │   ├── AttackSystem.js # Ataque básico com detecção de colisão
        │   ├── SkillSystem.js  # Fireball, AOE, Dash, Shield
        │   ├── DamageCalculator.js # Fórmulas de dano, crit, lifesteal
        │   ├── CollisionHandler.js # Detecção herói ↔ monstro ↔ item
        │   └── StatusEffects.js    # Buffs e debuffs
        ├── entities/
        │   ├── Entity.js       # Base com posição, HP, ataque
        │   ├── Player.js       # Dados e métodos do herói
        │   ├── Monster.js      # Criação e IA dos monstros
        │   ├── Boss.js         # Lógica especial de boss
        │   ├── Projectile.js   # Projéteis (fireball)
        │   ├── AOE.js          # Área de efeito
        │   ├── Item.js         # Entidade de item no chão
        │   └── Particle.js     # Partícula de efeito visual
        ├── world/
        │   ├── BiomeManager.js # Transição de biomas por nível
        │   ├── SpawnSystem.js  # Spawn dinâmico de monstros
        │   └── LootSystem.js   # Drop de itens com raridade
        ├── inventory/
        │   ├── InventoryManager.js # Adicionar, remover, usar itens
        │   ├── EquipmentSystem.js  # Equipar e desequipar slots
        │   └── ShopSystem.js       # Compra e venda de itens
        ├── progression/
        │   ├── ExperienceSystem.js # XP, level up, skill points
        │   ├── SkillTree.js        # Árvore de habilidades passivas e ativas
        │   ├── AchievementSystem.js# Conquistas por marcos de progresso
        │   └── QuestSystem.js      # Missões por tipo de inimigo/item
        └── api/
            ├── ApiService.js       # Base de requisições HTTP
            ├── PlayerAPI.js        # Endpoints de player
            ├── InventoryAPI.js     # Endpoints de inventário
            └── LeaderboardAPI.js   # Endpoints de ranking
```

---

## Decisões de design

**GameState como singleton explícito** — todos os sistemas importam e escrevem diretamente em `state`. Simples, sem boilerplate, sem prop drilling. O estado é um objeto plano e serializável — o que torna o save/load trivial.

**EventBus para desacoplamento** — eventos como `monster:kill`, `player:die`, `biome:change` permitem que sistemas reajam a mudanças sem se importar de onde elas vieram. O `GameLoop` emite, `AchievementSystem` ouve — sem referência cruzada.

**Config separada de estado** — `Config.js` só contém dados imutáveis (biomas, monstros, raridades, catálogo da loja). Nenhum sistema modifica isso. Facilita balanceamento sem tocar em lógica.

**GameLoop com deltaTime** — o loop usa `requestAnimationFrame` e normaliza o movimento por `dt / 16.67` para que a velocidade do jogo seja independente do FPS.

**Módulos com import dinâmico** — habilidades de combate (`SkillSystem`, `AttackSystem`) são carregadas sob demanda via `import()` nos atalhos de teclado. Reduz o bundle inicial.

**Sem framework, sem build** — o projeto usa ES Modules nativos do browser (`type="module"`). Sem Webpack, Vite, Rollup ou transpilação. Abre o `index.html` e funciona.

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| **Three.js** (CDN) | Renderização 3D — cena, câmera, geometrias, materiais, iluminação |
| **ES Modules** | Organização de código sem build step |
| **localStorage** | Persistência de saves |
| **CSS puro** | UI, HUD, animações e layout responsivo |
| **requestAnimationFrame** | Game loop com deltaTime |

---

## Como rodar

Qualquer servidor HTTP estático serve. Exemplos:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code — extensão Live Server
```

Abra `http://localhost:8080` e comece a jogar.

> Não funciona com `file://` por conta dos ES Modules — precisa de um servidor HTTP.

---

## Testes

Os testes ficam em `/tests` e rodam no browser via `tests/index.html`. Cobrem as unidades de lógica pura: `EventBus`, `Entity`, `DamageCalculator` e `Item`.

```
tests/
├── index.html              # Runner visual no browser
├── runner.js               # Micro framework de assert
├── EventBus.test.js
├── Entity.test.js
├── DamageCalculator.test.js
└── Item.test.js
```

---

*Eldoria — feito com JavaScript puro e muita vontade de matar monstros.*
