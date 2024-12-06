import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, DropdownSection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { FaArrowLeft } from 'react-icons/fa';
import { MdOutlineKeyboardReturn } from 'react-icons/md';
import { FaInfo, FaX } from 'react-icons/fa6';

const PDFViewer = ({ isOpen, onClose, PDFUrl, showInfoButton = true, groupName, groupMembers }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    let fileName = null;
    let adjustedUrl = PDFUrl;

    // Validates a protected routes with prefix when appended
    if (PDFUrl && PDFUrl.startsWith('storage')) {
        adjustedUrl = `${window.location.origin}/${PDFUrl}`;
    }

    // Get the file name based on the PDFUrl
    if (PDFUrl && PDFUrl.includes('capstone_files')) {
        fileName = PDFUrl.slice(PDFUrl.indexOf('capstone_files') + 'capstone_files'.length + 1);
        console.log(fileName);
    }

    return (
        <Modal
            size="5xl"
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton
            isDismissable={false}
            className="h-[90dvh] p-0 m-0"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="bg-customBlue text-white p-2 flex h-full justify-between items-center">
                                <div className="h-full ">
                                    <Button
                                        onClick={onClose}
                                    >
                                        <FaX />
                                    </Button>
                                </div>
                                <div>
                                    <h1 className="w-full text-center">
                                        {fileName}
                                    </h1>
                                </div>
                                {showInfoButton && (
                                    <div>
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button isIconOnly  >
                                                    <FaInfo />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Static Actions">
                                                <DropdownSection showDivider>
                                                    <DropdownItem key="new">{groupName}</DropdownItem>
                                                </DropdownSection>
                                                <DropdownSection showDivider>
                                                    <DropdownItem key="copy">Copy link</DropdownItem>
                                                    <DropdownItem key="edit">Edit file</DropdownItem>
                                                    <DropdownItem key="delete" className="text-danger" color="danger">
                                                        Delete file
                                                    </DropdownItem>
                                                </DropdownSection>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>)
                                }
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}>
                                <Viewer
                                    fileUrl={adjustedUrl} // Use the adjusted URL
                                    theme="light"
                                    plugins={[defaultLayoutPluginInstance]}

                                />
                            </Worker>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default PDFViewer;
