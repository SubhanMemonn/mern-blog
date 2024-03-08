import { create } from "zustand"

const useComment = create((set) => ({
    comments: [],
    setComments: (comments) => set({ comments })
}));
export default useComment;