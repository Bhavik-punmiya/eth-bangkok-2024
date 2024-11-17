import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";

const AuditModal = ({ isOpen, onClose, onSelectOption, contractCode }) => {
  const handleSpearbitAudit = () => {
    const emailSubject = "General Inquiry";
    const emailBody = `Dear Spearbit Team,

I hope this message finds you well.

I would like to inquire about the following:

Please review the following smart contract code for security vulnerabilities and best practices:

${contractCode}

Thank you for your attention to this matter.

Sincerely,`;

    const mailtoLink = `mailto:sales@spearbit.com?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoLink;
    onSelectOption("spearbit");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Select Audit Method
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <Card
              isPressable
              className="hover:scale-105 transition-transform"
              onClick={() => {
                onSelectOption("agent");
                onClose();
              }}
            >
              <CardBody className="p-4 flex flex-row gap-3 items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Audit using Agent</h3>
                  <p className="text-sm text-gray-500">
                    Quick automated analysis using our AI agent
                  </p>
                </div>
                <div className="text-lg">$5</div>
              </CardBody>
            </Card>

            <Card
              isPressable
              className="hover:scale-105 transition-transform"
              onClick={handleSpearbitAudit}
            >
              <CardBody className="p-4 flex flex-row gap-3 items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Audit using SpearBit
                  </h3>
                  <p className="text-sm text-gray-500">
                    Professional audit service by SpearBit
                  </p>
                </div>
                <div className="text-lg">$100</div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuditModal;
