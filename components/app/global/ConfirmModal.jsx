"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

export default function ConfirmModal({
  isOpen = false,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
}) {
  // "Kapat" butonu veya modal dışında tıklama
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // "Evet, Sil" butonu
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    // Onaydan sonra modal'ın kapanmasını istiyorsanız:
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title}
            </ModalHeader>
            <ModalBody>
              <p>{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button 
                color="danger" 
                variant="light" 
                onPress={handleClose}
              >
                {cancelText}
              </Button>
              <Button 
                color="primary" 
                onPress={handleConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
