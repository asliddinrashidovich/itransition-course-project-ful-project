function AnswersTableView({TemplateAnswers, FormTemplateQuestions}) {
  return (
    <div className='overflow-x-auto min-h-[60vh] '>
        <table className="w-full">
            <thead>
                <tr className="border-b-[1px] border-[#c1c1c1] ">
                    <td className="min-w-[100px] text-[15px] text-start font-[700]">
                        Email
                    </td>
                    {FormTemplateQuestions?.map(itemQuestion => (
                        <td className="text-[15px] md:text-[15px] font-[700] min-w-[160px] py-[10px]">{itemQuestion.title}</td>
                    ))}
                </tr>
            </thead>
            <tbody>
                {TemplateAnswers?.map(item => (
                    <tr key={item.responderEmail} className="border-b-[1px] border-[#c1c1c1] ">
                        <td className="text-[15px] text-start font-[400] pr-[10px]">
                            {item.responderEmail}
                        </td>
                        {FormTemplateQuestions?.map(ItemQuestion => (
                            <td key={ItemQuestion.questionId} className="py-[10px]">
                                {item.answers.filter(answerItem => answerItem.questionId === ItemQuestion.id).length  
                                    ? (() => {
                                        const answerVal = item.answers.find(a => a.questionId === ItemQuestion.id)?.value;
                                        return (
                                        <p className="text-[15px] font-[300]">
                                            {Array.isArray(answerVal) ? answerVal.join(', ') : answerVal}
                                        </p>
                                        );
                                    })()
                                    : <p>-</p>}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default AnswersTableView