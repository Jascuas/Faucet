

export const loadContract = (name) => {
    await fetch(`/contracts/${name}.json`)
}