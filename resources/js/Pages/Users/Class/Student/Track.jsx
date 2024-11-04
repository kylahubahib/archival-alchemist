import React, { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import {Card, CardFooter, Image, Button, ModalBody} from "@nextui-org/react";
import axios from 'axios';

export default function Track({manuscript=[]}) {
    const [expanded, setExpanded] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [revisionHistory, setRevisionHistory] = useState(null);

    const toggleTimeline = (data) => {
        setRevisionHistory(data);
        setModalContent('');
        setExpanded(!expanded);
    };

    const openModal = (data, content) => {
        setModalContent(content);
        setSelectedData(data);
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setSelectedData(null);
        setModalContent('');
        setIsModalOpen(false);
    };

    const modifyDocument = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className={`h-screen w-full border-none rounded-lg shadow-lg p-4 transition-height duration-300 ease-in-out ${expanded ? 'h-auto' : 'h-32'} bg-gray-100`}>
            
            {manuscript.length > 0 ? (
                manuscript.map((data)=> (
                    <div className="flex items-center justify-between pb-3" key={data.id}>
                        <div>
                            <div className="text-lg font-bold">{data.man_doc_title}</div>
                            <div className="text-base text-blue-500 cursor-pointer" onClick={() => openModal(data, 'manuscript')}>
                                Details
                            </div>
                        </div>

                        <div>
                            <div className="text-base font-bold">
                                Status: {data.man_doc_status != 'X' ? 'APPROVED' : 'PENDING'}
                            </div>
                            <div className="text-base text-blue-500 cursor-pointer" onClick={() => toggleTimeline(data)}>
                                {expanded ? 'See Less' : 'See More'}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex justify-center items-center space-y-3">
                    No pending manuscripts
                </div>
            )
            }

            {expanded && (
                <VerticalTimeline>
                    {revisionHistory.revision_history.length > 0 ? (
                        revisionHistory.revision_history.map((data)=>(
                            <VerticalTimelineElement
                                key={data.id}
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: "white", color: "black" }}
                                contentArrowStyle={{ borderRight: "7px solid white" }}
                                date={data.created_at}
                                iconStyle={{ background: "rgb(33, 150, 243)", color: "#000" }}
                            >
                                <h3 className="vertical-timeline-element-title">{data.status}</h3>
                                <p className="cursor-pointer" onClick={() => openModal(data, 'revision')}>Click for details</p>
                            </VerticalTimelineElement>
                        ))
                  
                    ) : (null)}

                    {/* <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/03/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Declined</h3>
                        <p className="cursor-pointer" onClick={() => openModal('05/03/2024 Declined')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/03/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Revised</h3>
                        <p className="cursor-pointer" onClick={() => openModal('05/03/2024 Revised')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/10/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Declined</h3>
                        <p className="cursor-pointer" onClick={() => openModal('05/10/2024 Declined')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/10/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Revised</h3>
                        <p className="cursor-pointer" onClick={() => openModal('05/10/2024 Revised')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/10/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Approved</h3>
                        <p className="cursor-pointer" onClick={() => openModal('05/10/2024 Approved')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        iconStyle={{ background: "#32CD32", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Congratulations!🎉</h3>
                    </VerticalTimelineElement> */}

                </VerticalTimeline>
            )}

            {modalContent == 'manuscript' && (
                <Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-5 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    
                    {/* Left side - Image Card */}
                    <div className="md:w-1/2">
                    <Card isFooterBlurred radius="lg" className="border-none">
                        <iframe width={500} height={400} allowFullScreen src={selectedData.man_doc_content + '/preview'}/>
                        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                        <p className="text-tiny text-white/80">Available soon.</p>
                        <Button onClick={() => modifyDocument(selectedData.man_doc_content)} className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
                            Open
                        </Button>
                        </CardFooter>
                    </Card>
                    </div>

                    {/* Right side - Content Section */}
                    <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-bold text-gray-900">Title: {selectedData.man_doc_title}</h2>

                    {/* Authors */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        <p className="text-gray-700 mt-1">Author:</p>
                        {selectedData.authors?.length > 0 ? (
                        <p className="text-gray-700 mt-1">
                            {selectedData.authors.map(author => author.name).join(', ')}
                        </p>
                        ) : (
                        <p className="text-gray-700 mt-1">No authors Available</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mt-2">
                        <p className="text-gray-700 mt-1">Abstract: </p>
                        <p className="text-gray-700 mt-1">{selectedData.man_doc_description}</p>
                    </div>
                    
                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedData.tags && selectedData.tags.length > 0 ? (
                        selectedData.tags.map(tag => (
                            <span key={tag.id} className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                            {tag.tags_name}
                            </span>
                        ))
                        ) : (
                        <p>No tags available</p>
                        )}
                    </div>
                    </div>

                </div>
                </Modal>

            )}

            {modalContent == 'revision' && 
            (<Modal show={isModalOpen} onClose={closeModal}>
                <div className="p-5 md:space-x-4 space-y-5 md:space-y-0">
                    <h2 className="text-xl text-gray-900">Title: {revisionHistory.man_doc_title}</h2>
                    

                    <div className="mt-2">
                        <p className="text-gray-700 mt-1">{selectedData.status == 'Started' ? 'To Be Reviewed By:' : 'Reviewed By'}</p>
                        <p className="text-gray-700 mt-1">{selectedData.faculty.name}</p>
                    </div>

                    <div className="mt-2">
                        <p className="text-gray-700 mt-1">Adviser's Remarks: </p>
                        <p className="text-gray-700 mt-1">{selectedData.ins_comment}</p>
                    </div>

                </div>
            </Modal>)}
        </div>
    );
};

