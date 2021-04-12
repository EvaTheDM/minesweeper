export default {
    difficulty: {
        Beginner: {
            size: { w: 9, h: 9 },
            mines: 10
        },
        Intermediate: {
            size: { w: 16, h: 16 },
            mines: 40
        },
        Expert: {
            size: { w: 30, h: 16 },
            mines: 99
        }
    },
    status: {
        HIDDEN: 'hidden',
        REVEALED: 'revealed',
        MINE: 'mine',
        MARKED: 'marked'
    }
};
