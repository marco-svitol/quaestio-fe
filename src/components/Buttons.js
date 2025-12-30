export const PrimaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-3 px-6 min-w-[150px] rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" onClick={click}>{text}</button>
    )
}

export const MiniPrimaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-2 px-4 min-w-[100px] rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 font-medium whitespace-nowrap text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5" onClick={click} >{text}</button>
    )
}

export const SecondaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-3 px-6 min-w-[150px] rounded-lg border border-slate-300 bg-white font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md text-slate-700" onClick={click}>{text}</button>
    )
}

export const MiniSecondaryButton = ({ text, click }) => {
    return (
        <button className="my-4 py-2 px-4 min-w-[100px] rounded-lg border border-slate-300 bg-white font-medium whitespace-nowrap hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow-md text-slate-700" onClick={click} >{text}</button>
    )
}

export const DisabledButton = ({ text }) => {
    return (
        <button className="my-4 py-3 px-6 min-w-[150px] rounded-lg bg-slate-300 text-slate-500 font-medium cursor-not-allowed opacity-60">{text}</button>
    )
}

export const MiniDisabledButton = ({ text, click }) => {
    return (
        <button className="my-4 py-2 px-4 min-w-[100px] rounded-lg bg-slate-300 font-medium whitespace-nowrap text-slate-500 cursor-not-allowed opacity-60" onClick={click} >{text}</button>
    )
}