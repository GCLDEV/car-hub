# Design System - Color Tokens

Este arquivo documenta como usar os tokens de cor para evitar cores hardcoded no projeto.

## Tokens de Transparência

### Preto com transparência (alpha.black)
- `colors.alpha.black[10]` - rgba(0, 0, 0, 0.1) - 10% de opacidade
- `colors.alpha.black[20]` - rgba(0, 0, 0, 0.2) - 20% de opacidade
- `colors.alpha.black[30]` - rgba(0, 0, 0, 0.3) - 30% de opacidade
- `colors.alpha.black[40]` - rgba(0, 0, 0, 0.4) - 40% de opacidade
- `colors.alpha.black[50]` - rgba(0, 0, 0, 0.5) - 50% de opacidade
- `colors.alpha.black[60]` - rgba(0, 0, 0, 0.6) - 60% de opacidade
- `colors.alpha.black[70]` - rgba(0, 0, 0, 0.7) - 70% de opacidade
- `colors.alpha.black[80]` - rgba(0, 0, 0, 0.8) - 80% de opacidade
- `colors.alpha.black[90]` - rgba(0, 0, 0, 0.9) - 90% de opacidade

### Branco com transparência (alpha.white)
- `colors.alpha.white[5]` - rgba(255, 255, 255, 0.05) - 5% de opacidade
- `colors.alpha.white[8]` - rgba(255, 255, 255, 0.08) - 8% de opacidade
- `colors.alpha.white[10]` - rgba(255, 255, 255, 0.1) - 10% de opacidade
- `colors.alpha.white[12]` - rgba(255, 255, 255, 0.12) - 12% de opacidade
- `colors.alpha.white[15]` - rgba(255, 255, 255, 0.15) - 15% de opacidade
- `colors.alpha.white[20]` - rgba(255, 255, 255, 0.2) - 20% de opacidade
- `colors.alpha.white[25]` - rgba(255, 255, 255, 0.25) - 25% de opacidade
- `colors.alpha.white[30]` - rgba(255, 255, 255, 0.3) - 30% de opacidade
- `colors.alpha.white[40]` - rgba(255, 255, 255, 0.4) - 40% de opacidade
- `colors.alpha.white[50]` - rgba(255, 255, 255, 0.5) - 50% de opacidade
- `colors.alpha.white[60]` - rgba(255, 255, 255, 0.6) - 60% de opacidade
- `colors.alpha.white[70]` - rgba(255, 255, 255, 0.7) - 70% de opacidade
- `colors.alpha.white[80]` - rgba(255, 255, 255, 0.8) - 80% de opacidade
- `colors.alpha.white[90]` - rgba(255, 255, 255, 0.9) - 90% de opacidade

## Exemplos de Uso

### ❌ Antes (hardcoded)
```tsx
<Box 
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)'
  }}
>
  <Text>Conteúdo</Text>
</Box>
```

### ✅ Depois (usando tokens)
```tsx
import { colors } from '@theme/colors'

<Box 
  style={{
    backgroundColor: colors.alpha.white[8],
    borderColor: colors.alpha.white[12]
  }}
>
  <Text>Conteúdo</Text>
</Box>
```

## Casos de Uso Comuns

### Modals e Overlays
- Fundo escuro: `colors.alpha.black[80]`
- Fundo médio: `colors.alpha.black[50]`

### Glassmorphism e Cards
- Background sutil: `colors.alpha.white[5]`
- Background médio: `colors.alpha.white[8]`
- Bordas: `colors.alpha.white[10]` ou `colors.alpha.white[12]`

### Headers Transparentes
- Fundo escuro: `colors.alpha.black[60]`
- Fundo claro: `colors.alpha.white[30]`

### Divisores e Separadores
- Linhas: `colors.alpha.white[10]`

## Benefícios

1. **Consistência**: Todos os valores são padronizados
2. **Manutenibilidade**: Fácil de alterar em um lugar só
3. **Legibilidade**: Nome semantico em vez de valores rgba
4. **IntelliSense**: Autocompletar ajuda a encontrar os valores
5. **Tipagem**: TypeScript garante que os valores existem