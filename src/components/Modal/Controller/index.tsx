import { useModalStore } from '@store/modalStore'
import React, { useEffect } from 'react'
import { BackHandler } from 'react-native'
import ModalConfirm from '../Confirm'
import ModalInfo from '../Info'
import ModalOptions from '../Options'

interface ModalControllerProps {}

export default function ModalController(props: ModalControllerProps) {
    const { modal, setModal } = useModalStore()

  useEffect(() => {
    const backAction = () => {
      if (modal) {
        setModal(null)
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    )

    return () => {
      backHandler.remove()
    }
  }, [modal, setModal])

  return (
    <>
      {modal?.type === 'confirm' && <ModalConfirm />}
      {modal?.type === 'info' && <ModalInfo />}
      {modal?.type === 'options' && <ModalOptions />}
    </>
  )
}



