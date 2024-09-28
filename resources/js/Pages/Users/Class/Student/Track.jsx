import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const Track = () => {
    const [expanded, setExpanded] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleTimeline = () => {
        setExpanded(!expanded);
    };

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={`h-screen w-full border-none rounded-lg shadow-lg p-4 transition-height duration-300 ease-in-out ${expanded ? 'h-auto' : 'h-32'} bg-[#C2E0FF]`}>
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-lg font-bold">The Archival Alchemist</div>
                    <div className="text-base text-blue-500 cursor-pointer" onClick={() => openModal('Details content')}>
                        Details
                    </div>
                </div>

                <div>
                    <div className="text-base font-bold">
                        Status: Approved
                    </div>
                    <div className="text-base text-blue-500 cursor-pointer" onClick={toggleTimeline}>
                        {expanded ? 'See Less' : 'See More'}
                    </div>
                </div>
            </div>

            {expanded && (
                <VerticalTimeline>
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="01/03/2021"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#000" }}
                    >
                        <h3 className="vertical-timeline-element-title">Started</h3>
                        <p className="cursor-pointer" onClick={() => openModal('01/03/2021 Started')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
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
                    </VerticalTimelineElement>
                </VerticalTimeline>
            )}

            {isModalOpen && (
                <Modal show={isModalOpen} onClose={closeModal}>
                    {modalContent}
                </Modal>
            )}
        </div>
    );
};

export default Track;
