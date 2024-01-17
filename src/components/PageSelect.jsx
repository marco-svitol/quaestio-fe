import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PageSelect = ({ page, selectPage }) => {
    const pagedData = useSelector((state) => state.search.pagedData);
    const totalPages = pagedData.length;

    const [elements, setElements] = useState([]);

    useEffect(() => {
        if (totalPages) {
            const newElements = [];
            const startPage = Math.max(1, page - 2);
            const endPage = Math.min(totalPages, page + 2);
            for (let i = startPage; i <= endPage; i++) {
                newElements.push(i);
            }
            setElements(newElements);
        }
    }, [totalPages, page])
    return (

        <div className="flex items-center gap-4 mt-4">
            <i className={`fi fi-sr-angle-square-left text-3xl mb-[-8px] ${page > 1 ? 'text-red-800 cursor-pointer hover:text-red-900' : 'text-red-50'} `} onClick={page > 1 ? () => selectPage(page - 1) : undefined}></i>
            {page > 3 && '...'}
            {
                elements.length !== 0 && elements.map((element, index) => (
                    <div key={index}
                        className={`p-2 border-stone-200 rounded ${element !== page && 'border-2 cursor-pointer hover:bg-stone-100 text-red-800'}`}
                        onClick={element !== page ? (() => selectPage(element)) : undefined}
                    >{element}</div>
                ))
            }
            {page < totalPages - 2 && '...'}
            <i className={`fi fi-sr-angle-square-right text-3xl mb-[-8px] ${page < totalPages ? 'text-red-800 cursor-pointer hover:text-red-900' : 'text-red-50'}`} onClick={page < totalPages ? () => selectPage(page + 1) : undefined}></i>
        </div>


    )
}

export default PageSelect;