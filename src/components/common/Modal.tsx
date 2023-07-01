import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { defineStyleConfig } from '@chakra-ui/react';

const ChakraStyledModal = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderRadius: 'base', // <-- border radius is same for all variants and sizes
    backgroundColor: '#181818',
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: 'sm',
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: 'md',
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: '2px solid',
      borderColor: 'purple.500',
      color: 'purple.500',
    },
    solid: {
      bg: 'purple.500',
      color: 'white',
    },
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'outline',
  },
});
export default function Modal({
  onClose,
  isOpen,
  onSubmit,
  modalLabel,
  children,
  actionLabel = 'Action',
}: {
  onClose: () => void;
  children?: React.ReactNode;
  onSubmit: () => void;
  isOpen: boolean;
  modalLabel: string;
  actionLabel: string;
}) {
  return (
    <ChakraModal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent __css={ChakraStyledModal} className="bg-primary">
        <ModalHeader>{modalLabel}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter className="flex justify-center">
          <Button colorScheme="purple" onClick={onSubmit}>
            {actionLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
