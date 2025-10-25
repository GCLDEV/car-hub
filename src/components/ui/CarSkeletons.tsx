import React from 'react'
import { VStack } from '@components/ui/vstack'
import { HStack } from '@components/ui/hstack'
import { Box } from '@components/ui/box'
import { Skeleton, SkeletonText } from '@components/ui/skeleton'
import { colors } from '@theme/colors'

interface CarCardSkeletonProps {
  count?: number
}

export function CarCardSkeleton({ count = 1 }: CarCardSkeletonProps) {
  return (
    <VStack space="md" className="px-4">
      {Array.from({ length: count }).map((_, index) => (
        <Box 
          key={index}
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: colors.alpha.white[8],
            borderWidth: 1,
            borderColor: colors.alpha.white[12]
          }}
        >
          {/* Image skeleton */}
          <Skeleton 
            className="w-full h-48 rounded-t-2xl" 
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          
          <VStack className="p-4" space="md">
            {/* Title skeleton */}
            <SkeletonText 
              className="h-6 w-3/4 rounded"
              startColor="bg-neutral-700"
              isLoaded={false}
            />
            
            {/* Price and year row */}
            <HStack className="justify-between items-center">
              <SkeletonText 
                className="h-5 w-24 rounded"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              <SkeletonText 
                className="h-4 w-12 rounded"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
            </HStack>
            
            {/* Location skeleton */}
            <SkeletonText 
              className="h-4 w-1/2 rounded"
              startColor="bg-neutral-700"
              isLoaded={false}
            />
            
            {/* Specs row */}
            <HStack className="justify-between">
              <SkeletonText 
                className="h-4 w-16 rounded"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              <SkeletonText 
                className="h-4 w-20 rounded"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              <SkeletonText 
                className="h-4 w-18 rounded"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
            </HStack>
          </VStack>
        </Box>
      ))}
    </VStack>
  )
}

interface HomeHeaderSkeletonProps {}

export function HomeHeaderSkeleton({}: HomeHeaderSkeletonProps) {
  return (
    <VStack space="lg" className="px-4 pt-4 pb-6" style={{ backgroundColor: colors.neutral[900] }}>
      {/* Top bar skeleton */}
      <HStack className="justify-between items-center">
        {/* Location skeleton */}
        <HStack className="items-center flex-1">
          <Skeleton 
            className="w-4 h-4 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <SkeletonText 
            className="h-4 w-24 ml-2 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        </HStack>
        
        {/* Actions skeleton */}
        <HStack className="items-center" space="md">
          <Skeleton 
            className="w-10 h-10 rounded-xl"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <Skeleton 
            className="w-10 h-10 rounded-xl"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        </HStack>
      </HStack>

      {/* Greeting skeleton */}
      <VStack space="xs">
        <SkeletonText 
          className="h-8 w-48 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        <SkeletonText 
          className="h-5 w-64 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
      </VStack>

      {/* Search bar skeleton */}
      <Skeleton 
        className="w-full h-14 rounded-2xl"
        startColor="bg-neutral-700"
        isLoaded={false}
      />

      {/* Categories skeleton */}
      <HStack space="sm">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton 
            key={index}
            className="flex-1 h-20 rounded-2xl"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        ))}
      </HStack>
    </VStack>
  )
}

interface HomeContentSkeletonProps {}

export function HomeContentSkeleton({}: HomeContentSkeletonProps) {
  return (
    <VStack className="flex-1" space="lg">
      {/* Categories skeleton */}
      <HStack space="sm" className="px-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton 
            key={index}
            className="flex-1 h-20 rounded-2xl"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        ))}
      </HStack>
      
      {/* Section title skeleton */}
      <VStack className="px-4" space="sm">
        <SkeletonText 
          className="h-6 w-40 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        <SkeletonText 
          className="h-4 w-16 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
      </VStack>
      
      {/* Car cards skeleton */}
      <CarCardSkeleton count={4} />
    </VStack>
  )
}

interface CarDetailSkeletonProps {}

export function CarDetailSkeleton({}: CarDetailSkeletonProps) {
  return (
    <VStack className="flex-1" space="lg">
      {/* Image Gallery skeleton */}
      <Box className="w-full" style={{ height: 300 }}>
        <Skeleton 
          className="w-full h-full"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
      </Box>
      
      {/* Car Description skeleton */}
      <VStack className="px-4" space="md">
        {/* Title skeleton */}
        <SkeletonText 
          className="h-8 w-3/4 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        
        {/* Brand/Model skeleton */}
        <HStack className="justify-between">
          <SkeletonText 
            className="h-5 w-24 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <SkeletonText 
            className="h-5 w-16 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        </HStack>
        
        {/* Description skeleton */}
        <VStack space="xs">
          <SkeletonText 
            className="h-4 w-full rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <SkeletonText 
            className="h-4 w-5/6 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <SkeletonText 
            className="h-4 w-4/5 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        </VStack>
      </VStack>
      
      {/* Price and Rating skeleton */}
      <VStack className="px-4" space="md">
        <HStack className="justify-between items-center">
          <SkeletonText 
            className="h-8 w-32 rounded"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <HStack className="items-center" space="sm">
            <Skeleton 
              className="w-6 h-6 rounded"
              startColor="bg-neutral-700"
              isLoaded={false}
            />
            <SkeletonText 
              className="h-5 w-8 rounded"
              startColor="bg-neutral-700"
              isLoaded={false}
            />
          </HStack>
        </HStack>
        
        <Skeleton 
          className="w-10 h-10 rounded-full"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
      </VStack>
      
      {/* Specs Grid skeleton */}
      <VStack className="px-4" space="md">
        <SkeletonText 
          className="h-6 w-32 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        
        <VStack space="sm">
          {/* 3 rows of specs */}
          {Array.from({ length: 3 }).map((_, rowIndex) => (
            <HStack key={rowIndex} className="justify-between">
              {Array.from({ length: 2 }).map((_, colIndex) => (
                <Box 
                  key={colIndex}
                  className="flex-1 mx-1 p-4 rounded-xl"
                  style={{
                    backgroundColor: 'colors.alpha.white[8]',
                    borderWidth: 1,
                    borderColor: 'colors.alpha.white[12]'
                  }}
                >
                  <VStack space="xs" className="items-center">
                    <Skeleton 
                      className="w-6 h-6 rounded"
                      startColor="bg-neutral-700"
                      isLoaded={false}
                    />
                    <SkeletonText 
                      className="h-4 w-16 rounded"
                      startColor="bg-neutral-700"
                      isLoaded={false}
                    />
                    <SkeletonText 
                      className="h-3 w-12 rounded"
                      startColor="bg-neutral-700"
                      isLoaded={false}
                    />
                  </VStack>
                </Box>
              ))}
            </HStack>
          ))}
        </VStack>
      </VStack>
      
      {/* Action Buttons skeleton */}
      <VStack className="px-4 pb-8" space="sm">
        <HStack space="sm">
          <Skeleton 
            className="flex-1 h-12 rounded-xl"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
          <Skeleton 
            className="flex-1 h-12 rounded-xl"
            startColor="bg-neutral-700"
            isLoaded={false}
          />
        </HStack>
        
        <Skeleton 
          className="w-full h-12 rounded-xl"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
      </VStack>
    </VStack>
  )
}

interface ProfileContentSkeletonProps {}

export function ProfileContentSkeleton({}: ProfileContentSkeletonProps) {
  return (
    <VStack className="flex-1" space="lg">
      {/* Profile Menu Sections skeleton */}
      {/* Minha Conta Section */}
      <VStack className="px-4" space="sm">
        <SkeletonText 
          className="h-6 w-32 ml-2 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        
        <VStack 
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'colors.alpha.white[8]',
            borderWidth: 1,
            borderColor: 'colors.alpha.white[12]'
          }}
        >
          {/* 3 menu items */}
          {Array.from({ length: 3 }).map((_, index) => (
            <HStack 
              key={index}
              className="items-center px-4 py-4"
              style={{
                borderBottomWidth: index < 2 ? 1 : 0,
                borderBottomColor: 'colors.alpha.white[10]'
              }}
            >
              {/* Icon skeleton */}
              <Skeleton 
                className="w-10 h-10 rounded-xl mr-4"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              
              <VStack className="flex-1" space="xs">
                <SkeletonText 
                  className="h-4 w-24 rounded"
                  startColor="bg-neutral-700"
                  isLoaded={false}
                />
                <SkeletonText 
                  className="h-3 w-40 rounded"
                  startColor="bg-neutral-700"
                  isLoaded={false}
                />
              </VStack>
              
              {/* Value skeleton */}
              <SkeletonText 
                className="h-4 w-6 rounded mr-2"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              
              {/* Arrow skeleton */}
              <Skeleton 
                className="w-4 h-4 rounded"
                startColor="bg-neutral-600"
                isLoaded={false}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
      
      {/* Configurações Section */}
      <VStack className="px-4" space="sm">
        <SkeletonText 
          className="h-6 w-28 ml-2 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        
        <VStack 
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'colors.alpha.white[8]',
            borderWidth: 1,
            borderColor: 'colors.alpha.white[12]'
          }}
        >
          {/* 3 menu items */}
          {Array.from({ length: 3 }).map((_, index) => (
            <HStack 
              key={index}
              className="items-center px-4 py-4"
              style={{
                borderBottomWidth: index < 2 ? 1 : 0,
                borderBottomColor: 'colors.alpha.white[10]'
              }}
            >
              <Skeleton 
                className="w-10 h-10 rounded-xl mr-4"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              
              <VStack className="flex-1" space="xs">
                <SkeletonText 
                  className="h-4 w-32 rounded"
                  startColor="bg-neutral-700"
                  isLoaded={false}
                />
                <SkeletonText 
                  className="h-3 w-36 rounded"
                  startColor="bg-neutral-700"
                  isLoaded={false}
                />
              </VStack>
              
              <Skeleton 
                className="w-4 h-4 rounded"
                startColor="bg-neutral-600"
                isLoaded={false}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
      
      {/* Suporte Section */}
      <VStack className="px-4" space="sm">
        <SkeletonText 
          className="h-6 w-20 ml-2 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        
        <VStack 
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: 'colors.alpha.white[8]',
            borderWidth: 1,
            borderColor: 'colors.alpha.white[12]'
          }}
        >
          {/* 2 menu items */}
          {Array.from({ length: 2 }).map((_, index) => (
            <HStack 
              key={index}
              className="items-center px-4 py-4"
              style={{
                borderBottomWidth: index < 1 ? 1 : 0,
                borderBottomColor: 'colors.alpha.white[10]'
              }}
            >
              <Skeleton 
                className="w-10 h-10 rounded-xl mr-4"
                startColor="bg-neutral-700"
                isLoaded={false}
              />
              
              <VStack className="flex-1" space="xs">
                <SkeletonText 
                  className="h-4 w-16 rounded"
                  startColor="bg-neutral-700"
                  isLoaded={false}
                />
                <SkeletonText 
                  className="h-3 w-28 rounded"
                  startColor="bg-neutral-700"
                  isLoaded={false}
                />
              </VStack>
              
              <Skeleton 
                className="w-4 h-4 rounded"
                startColor="bg-neutral-600"
                isLoaded={false}
              />
            </HStack>
          ))}
        </VStack>
      </VStack>
      
      {/* Test sections skeleton */}
      <VStack className="px-4 pb-8" space="sm">
        <SkeletonText 
          className="h-6 w-32 ml-2 rounded"
          startColor="bg-neutral-700"
          isLoaded={false}
        />
        
        <VStack 
          className="rounded-2xl p-4"
          space="sm"
          style={{
            backgroundColor: 'colors.alpha.white[8]',
            borderWidth: 1,
            borderColor: 'colors.alpha.white[12]'
          }}
        >
          {/* Test buttons skeleton */}
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton 
              key={index}
              className="w-full h-12 rounded-xl"
              startColor="bg-neutral-700"
              isLoaded={false}
            />
          ))}
        </VStack>
      </VStack>
    </VStack>
  )
}

export default CarCardSkeleton
