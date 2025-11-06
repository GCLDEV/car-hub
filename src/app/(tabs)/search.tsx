import React from 'react'
import { FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { VStack } from '@components/ui/vstack'

import SearchHeader from '@components/ui/SearchHeader'
import SearchCarCard from '@components/ui/SearchCarCard'
import SearchSuggestions from '@components/ui/SearchSuggestions'
import LoadingState from '@components/ui/LoadingState'
import ErrorState from '@components/ui/ErrorState'
import EmptyState from '@components/ui/EmptyState'

import { useModalStore } from '@store/modalStore'
import { useFiltersStore } from '@store/filtersStore'
import { colors } from '@theme/colors'
import { Car } from '@/types/car'
import useSearchController from '@controllers/useSearchController'



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
    applyFilters,
    clearSearch,
    showSearchModal,
    popularSearches
  } = useSearchController()
  
  const { filters, setFilters } = useFiltersStore()

  function renderCarItem({ item }: { item: Car }) {
    return (
      <SearchCarCard
        car={item}
        onPress={() => handleCarPress(item.id)}
      />
    )
  }

  function handleSuggestionPress(suggestion: string) {
    setSearchQuery(suggestion)
  }

  function handleFilterPress() {
    const { setModal } = useModalStore.getState()
    
    setModal({
      type: 'filters',
      title: 'Search Filters',
      filtersData: filters, // Passar filtros atuais
      onApplyFilters: (appliedFilters) => {
        // Converter os filtros para o formato correto do store
        const filtersToApply = {
          brand: appliedFilters.brand,
          yearFrom: appliedFilters.yearMin,
          yearTo: appliedFilters.yearMax,
          priceFrom: appliedFilters.priceMin,
          priceTo: appliedFilters.priceMax,
          fuelType: appliedFilters.fuelType,
          transmission: appliedFilters.transmission,
          kmTo: appliedFilters.maxKm
        }
        
        // Aplicar os filtros no store
        setFilters(filtersToApply)
        
        // Mostrar feedback
        const filterCount = Object.values(filtersToApply).filter(v => v !== undefined).length
        Toast.show({
          type: 'success',
          text1: 'Filters applied',
          text2: filterCount > 0 ? `${filterCount} filters active` : 'All filters cleared'
        })
        
        // Re-executar busca com novos filtros se já tinha query
        if (searchQuery.trim()) {
          setTimeout(applyFilters, 100) // Small delay to allow filters to be set
        }
      }
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
            title="No cars found"
            message="Try adjusting your search or filters"
            icon="🔍"
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