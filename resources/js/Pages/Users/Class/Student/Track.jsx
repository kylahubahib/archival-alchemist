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
        <div style={{
            width: '100%',
            border: 'none',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            position: 'relative',
            transition: 'height 0.3s ease',
            height: expanded ? 'auto' : '8rem',
            backgroundColor: '#C2E0FF'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>The Archival Alchemist</div>
                    <div style={{ fontSize: '1rem', color: 'blue', cursor: 'pointer' }} onClick={() => openModal('Details content')}>
                        Details
                    </div>
                </div>

                <div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Status: Approved
                    </div>
                    <div style={{ fontSize: '1rem', color: 'blue', cursor: 'pointer' }} onClick={toggleTimeline}>
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
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#black"}}
                    >
                        <h3 className="vertical-timeline-element-title">Started</h3>
                        <p onClick={() => openModal('01/03/2021 Started')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white)", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/03/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Declined</h3>
                        <p onClick={() => openModal('05/03/2024 Declined')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/03/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Revised</h3>
                        <p onClick={() => openModal('05/03/2024 Revised')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/10/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Declined</h3>
                        <p onClick={() => openModal('05/10/2024 Declined')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/10/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Revised</h3>
                        <p onClick={() => openModal('05/10/2024 Revised')}>Click for details</p>
                    </VerticalTimelineElement>

                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        contentStyle={{ background: "white", color: "black" }}
                        contentArrowStyle={{ borderRight: "7px solid white" }}
                        date="05/10/2024"
                        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
                    >
                        <h3 className="vertical-timeline-element-title">Approved</h3>
                        <p onClick={() => openModal('05/10/2024 Approved')}>Click for details</p>
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
