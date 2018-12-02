import * as types from "../actions/types";

const INITIAL_STATE = {
    auth: {
        name: 'Phuc', 
		id: 'Phuc89286488',
		following: '3', 
		followers: '2',
		url: 'https://pbs.twimg.com/profile_banners/1068876238993801216/1543684186/1500x500',
        avtUrl: 'https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg',
        date: 'December 2018',
        tweets: [{
            content: 'this is the test 1 content',
            date: new Date(2018, 11, 2, 23, 0)
        },
        {
            content: 'this is the test 2 content',
            date: new Date(2018, 10, 30, 12, 0)
        },
        {
            content: 'this is the test 3 content',
            date: new Date(2018, 10, 29, 7, 50)
        }]
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.LOGOUT:
            return INITIAL_STATE;
        default:
            return state;
    }
};
