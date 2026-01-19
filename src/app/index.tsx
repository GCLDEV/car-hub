import { Redirect } from 'expo-router'

export default function Index() {
  // Sempre redireciona para home
  // A autenticação será verificada apenas quando necessário:
  // - Abrir chat
  // - Criar anúncio  
  // - Favoritar
  // - Funcionalidades de usuário
  return <Redirect href="/(tabs)/home" />
}