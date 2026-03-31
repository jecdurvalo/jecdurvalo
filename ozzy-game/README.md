# Ozzy Game - Refatorado com Clean Code

Este projeto é uma versão refatorada do jogo "Ozzy - The Game" aplicando boas práticas de **Clean Code** e separação de responsabilidades.

## 📁 Estrutura do Projeto

```
ozzy-game/
├── index.html          # Arquivo HTML principal (limpo, apenas estrutura)
├── src/
│   ├── css/
│   │   └── styles.css  # Todos os estilos CSS separados
│   └── js/
│       └── game.js     # Lógica do jogo em JavaScript modular
└── assets/             # Pasta para assets futuros (imagens, sons, etc.)
```

## ✨ Melhorias Aplicadas (Clean Code)

### 1. **Separação de Responsabilidades**
- **HTML**: Apenas estrutura semântica
- **CSS**: Estilos organizados por seções com comentários
- **JavaScript**: Lógica dividida em classes especializadas

### 2. **Classes Especializadas**
- `InputHandler`: Gerencia entrada de teclado e touch
- `Player`: Lógica e renderização do jogador
- `Platform`, `Enemy`, `Coin`, `Flag`, `Boss`: Entidades do jogo
- `CollisionHandler`: Sistema de colisões centralizado
- `LevelManager`: Gerenciamento de níveis
- `Game`: Controlador principal do jogo

### 3. **Constantes Centralizadas**
- Objeto `CONFIG` com todas as configurações do jogo
- Fácil manutenção e ajuste de valores

### 4. **Nomes Significativos**
- Variáveis e funções com nomes descritivos
- Código autoexplicativo

### 5. **Funções Pequenas e Focadas**
- Cada método faz uma única coisa
- Métodos privados para detalhes de implementação (ex: `drawEars()`, `drawEyes()`)

### 6. **Comentários Úteis**
- Seções claramente delimitadas
- Comentários explicam o "porquê", não o "como"

### 7. **DRY (Don't Repeat Yourself)**
- Lógica de colisão reutilizável
- Setup de touch events consolidado

### 8. **Eventos Separados do DOM**
- Event listeners configurados via `addEventListener`
- Sem inline handlers (`onclick=""`)

## 🚀 Como Usar

1. Clone ou baixe este repositório
2. Abra o arquivo `index.html` em um navegador moderno
3. Jogue!

## 🎮 Controles

- **Teclado**: Setas ou WASD
- **Mobile**: Toque nos botões na tela

## 📝 Próximos Passos Sugeridos

1. **Modularização ES6**: Dividir `game.js` em módulos separados
2. **Webpack/Vite**: Adicionar bundler para produção
3. **Assets Externos**: Substituir desenhos canvas por sprites
4. **Sons e Música**: Adicionar sistema de áudio
5. **Persistência**: Salvar progresso no localStorage
6. **Tests**: Adicionar testes unitários para lógica crítica

## 🔗 Arquivo Original

O arquivo original `ozzy_mario.html` foi mantido intacto na raiz do workspace para referência.

---

Desenvolvido com ❤️ aplicando princípios de Clean Code
