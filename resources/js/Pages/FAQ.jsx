import { useEffect, useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Collapsible from '@/Components/Collapsible';

export default function FAQ({ auth }) {
    const guidelines = [
        {
            question: "Q&A Guidelines",
            answer: `At ResearchGate, we believe that meaningful, scientific discussions can help accelerate scientific progress. To help facilitate collaboration, we’ve created a Q&A forum where members can ask or answer questions, and have discussions in a research-focused environment. This collaborative approach to problem-solving can help you connect with specialists and build your reputation, at any stage of your career. We’ve put together these guidelines so that you can get the most out of Q&A – and to make sure it remains relevant, professional, and useful.`
        },
        {
            question: "Top tips for Q&A",
            answer: `· Make sure your question title is clear, concise, and asks a question.
· Search to see if your question has already been asked before posting.
· Recommend good questions and answers that contribute to the topic instead of saying “thanks” or “good question.”
· Keep it professional, polite, and respectful.
· Refer to our Community Guidelines and Q&A Guidelines for tips on proper conduct on ResearchGate.
· Report questions that violate our Community Guidelines, Terms of Service, or the law.`
        },
        {
            question: "Asking a good question",
            answer: `Your question is the first thing another researcher sees. It should be clear, concise, and contain enough information so that others can see what it’s about at first glance. It's best to be specific, so be sure to provide any necessary context and background information.`
        },
        {
            question: "Adding a good answer",
            answer: `A good answer is a comprehensive and considered response to the original question, and maybe even answers the question outright. Good answers often come from researchers who’ve experienced similar problems and can draw on their own research experience.`
        },
        {
            question: "Inappropriate behavior",
            answer: `We want to make sure that discussions on ResearchGate are constructive so that everyone feels free to express their professional opinions while remaining respectful and tolerant of others.`
        },
        {
            question: "Recommending and reporting",
            answer: `You can help determine which questions and answers are most visible in Q&A by recommending high-quality questions and answers.`
        },
        {
            question: "Commenting Guidelines",
            answer: `On ResearchGate, you can join in the discussion by adding comments to research items. Adding comments is a great way to discuss research in your field with experts, ask questions directly to the authors, and share your own expertise.`
        },
        {
            question: "Top tips for commenting",
            answer: `Comments are a great way to give feedback, ask questions, and interact with other researchers. Comments should be specific and relevant to the research you're interacting with.`
        },
    ];

    return (
        <GuestLayout user={auth.user}>
            <Head title="Frequently Asked Questions" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz@0,14..32;1,14..32&display=swap" rel="stylesheet"></link>

            <div className="bg-slate-200 min-h-screen">
                <div className="max-w-5xl mx-auto flex justify-between items-center p-5">
                    <Link href="/" className="text-blue-600 text-sm hover:underline">
                        &larr; Back
                    </Link>
                </div>

                <h1 className="text-5xl font-extrabold text-center mt-10" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900 }}>
                    Frequently Asked Questions
                </h1>

                <div className="max-w-2xl mx-auto mt-10">
                    {guidelines.map((item, index) => (
                        <div className="mb-5" key={index}> {/* Added margin bottom for spacing */}
                            <Collapsible 
                                question={
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                        {item.question}
                                    </span>
                                }
                                answer={
                                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200, color: '#6b7280' }}>
                                        {item.answer}
                                    </span>
                                }
                            />
                        </div>
                    ))}
                </div>
            </div>
        </GuestLayout>
    );
}
