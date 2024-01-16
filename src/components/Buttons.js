export const PrimaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-4 px-8 min-w-[150px] rounded-lg bg-red-800 hover:bg-red-900 text-white font-medium" onClick={click}>{text}</button>
    )
}

export const SecondaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-4 px-8 min-w-[150px] rounded-lg border-2 border-red-800 font-medium hover:bg-red-50" onClick={click}>{text}</button>
    )
}

export const MiniSecondaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-2 px-4 min-w-[100px] rounded-lg border-2 border-red-800 font-medium whitespace-nowrap hover:bg-red-50" onClick={click} >{text}</button>
    )
}

export const DisabledButton = ({ text }) => {
    return (
        <button className="my-4 py-4 px-8 min-w-[150px] rounded-lg bg-red-200 text-white font-medium cursor-default">{text}</button>
    )
}