import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { VStack } from '@components/ui/vstack'

import SearchHeader from '@components/ui/SearchHeader'
import SearchCarCard from '@components/ui/SearchCarCard'
import SearchSuggestions from '@components/ui/SearchSuggestions'
import LoadingState from '@components/ui/LoadingState'
import ErrorState from '@components/ui/ErrorState'
import EmptyState from '@components/ui/EmptyState'

import { colors } from '@theme/colors'
import { Car } from '@/types/car'
import useSearchController from '@controllers/useSearchController'
import { useModalStore } from '@/store/modalStore'



export default function SearchScreen() {
  const { setModal } = useModalStore()

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    refreshing,
    hasSearched,
    handleRefresh,
    handleLoadMore,
    handleCarPress,
    handleFavoritePress,
    isFavorite,
    applyFilters,
    clearSearch
  } = useSearchController()

  function renderCarItem({ item }: { item: Car }) {
    return (
      <SearchCarCard
        car={item}
        onPress={() => handleCarPress(item.id)}
        onFavoritePress={() => handleFavoritePress(item.id)}
        isFavorite={isFavorite(item.id)}
      />
    )
  }

  function handleSuggestionPress(suggestion: string) {
    setSearchQuery(suggestion)
  }

  function handleFilterPress() {
    setModal({
      type: 'options',
      title: 'Filtros de Busca',
      options: [
        { 
          title: '💰 Faixa de Preço', 
          action: () => {}, // TODO: Implementar filtro por preço
          variant: 'primary' 
        },
        { 
          title: '🚗 Marca', 
          action: () => {}, // TODO: Implementar filtro por marca
          variant: 'secondary' 
        },
        { 
          title: '📅 Ano', 
          action: () => {}, // TODO: Implementar filtro por ano
          variant: 'secondary' 
        },
        { 
          title: '⛽ Combustível', 
          action: () => {}, // TODO: Implementar filtro por combustível
          variant: 'secondary' 
        }
      ]
    })
  }

  if (loading && searchResults.length === 0 && searchQuery.trim()) {
    return <LoadingState message="Buscando carros..." />
  }

  if (error) {
    return (
      <ErrorState 
        message={error} 
        onRetry={handleRefresh}
      />
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[900] }}>
      <VStack className="flex-1">
        {/* Header de busca moderno */}
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFilterPress={handleFilterPress}
          onSearchSubmit={applyFilters}
          resultCount={hasSearched ? searchResults.length : undefined}
        />

        {/* Conteúdo principal */}
        {!hasSearched ? (
          <SearchSuggestions onSuggestionPress={handleSuggestionPress} />
        ) : searchResults.length === 0 ? (
          <EmptyState
            title="Nenhum carro encontrado"
            message="Tente ajustar sua busca ou filtros"
            icon="�"
          />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => item.id || `search-${index}-${Date.now()}`}
            renderItem={renderCarItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.accent[500]}
              />
            }
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <VStack className="h-3" />
            )}
          />
        )}
      </VStack>
    </SafeAreaView>
  )
}