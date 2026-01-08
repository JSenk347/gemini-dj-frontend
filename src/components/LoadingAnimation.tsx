
const LoadingAnimation = () => {
    return (
        <div className="w-full max-w-2xl mt-8 px-4 mx-auto mb-15 animate-pulse flex flex-col gap-4">
            <p className="text-center text-gray-500 mt-2">Generating your playlist...</p>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-lg w-full"></div>
            ))}
        </div>
    )
}

export default LoadingAnimation