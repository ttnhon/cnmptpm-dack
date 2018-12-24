import * as types from "../actions/types";

const INITIAL_STATE = {
    name: 'Phuc',
    id: 'Phuc89286488',
    publicKey: '',
    secretKey: '',
    bio: 'this is some thing I want to say',
    location: 'Viet Nam',
    website: 'https://twitter.com/Phuc89286488',
    birthday: new Date(1997, 1, 11),
    following: '3',
    followers: '2',
    url: 'https://pbs.twimg.com/profile_banners/1068876238993801216/1543684186/1500x500',
    avtUrl: 'https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg',
    date: new Date(2018, 11, 0),
    tweets: [{
        content: 'this is the test 1 content',
        date: new Date(2018, 11, 2, 23, 0),
        like: 10,
        retweet: 3,
        replies: [{
            owner: {
                name: 'person1',
                id: 'person1ID',
                avtUrl: 'https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg'
            },
            content: 'this is a comment of person 1',
            date: new Date(2018, 11, 2, 24, 0),
            like: 3,
            retweet: 5,
            replies: [{
                owner: {
                name: 'person2',
                id: 'person2ID',
                avtUrl: 'https://mertskaplan.com/wp-content/plugins/msk-twprofilecard/img/mertskaplan.jpg'
                },
                content: 'this is a comment of person 2',
                date: new Date(2018, 11, 3, 6, 0),
                like: 1,
                retweet: 2,
                replies: []
            }]
        },{
            owner: {
                name: 'person1',
                id: 'person1ID',
                avtUrl: 'https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg'
            },
            content: 'this is another comment of person 1',
            date: new Date(2018, 11, 3, 2, 0),
            like: 1,
            retweet: 1,
            replies: []
            }
        ]
    },
    {
        content: 'this is the test 2 content',
        date: new Date(2018, 10, 30, 12, 0),
        like: 10,
        retweet: 3,
        replies: [{
            owner: {
                name: 'person1',
                id: 'person1ID',
                avtUrl: 'https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg'
            },
            content: 'this is a comment of person 1',
            date: new Date(2018, 11, 2, 24, 0),
            like: 3,
            retweet: 5,
            replies: [{
                owner: {
                name: 'person2',
                id: 'person2ID',
                avtUrl: 'https://mertskaplan.com/wp-content/plugins/msk-twprofilecard/img/mertskaplan.jpg'
                },
                content: 'this is a comment of person 2',
                date: new Date(2018, 11, 3, 6, 0),
                like: 1,
                retweet: 2,
                replies: []
            }]
        },{
            owner: {
                name: 'person1',
                id: 'person1ID',
                avtUrl: 'https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg'
            },
            content: 'this is another comment of person 1',
            date: new Date(2018, 11, 2, 24, 0),
            like: 1,
            retweet: 1,
            replies: []
            }
        ]
    },
    {
        content: 'this is the test 3 content',
        date: new Date(2018, 10, 29, 7, 50),
        like: 10,
        retweet: 3,
        replies: [{
            owner: {
                name: 'person1',
                id: 'person1ID',
                avtUrl: 'https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg'
            },
            content: 'this is a comment of person 1',
            date: new Date(2018, 11, 2, 24, 0),
            like: 3,
            retweet: 5,
            replies: [{
                owner: {
                name: 'person2',
                id: 'person2ID',
                avtUrl: 'https://mertskaplan.com/wp-content/plugins/msk-twprofilecard/img/mertskaplan.jpg'
                },
                content: 'this is a comment of person 2',
                date: new Date(2018, 11, 3, 6, 0),
                like: 1,
                retweet: 2,
                replies: []
            }]
        },{
            owner: {
                name: 'person1',
                id: 'person1ID',
                avtUrl: 'https://pbs.twimg.com/profile_images/1067855959270125568/QkiSTiCV_bigger.jpg'
            },
            content: 'this is another comment of person 1',
            date: new Date(2018, 11, 2, 24, 0),
            like: 1,
            retweet: 1,
            replies: []
            }
        ]
    }]
};

export default (state = {}, action) => {
    switch (action.type) {
        case types.EDIT_PROFILE:
            return {
                ...state,
                ...action.payload
            };
        case types.SET_PUBLIC_KEY:
            return {
                ...state,
                publicKey: action.payload
            };
        case types.SET_SECRET_KEY:
            return {
                ...state,
                secretKey: action.payload
            };
        case types.SET_USER_PROFILE:
            return {
                ...state,
                user: action.payload
            };
        case types.ADD_SEQUENCE:
            return {
                ...state,
                user: {...state.user,
                    sequence: state.user.sequence + 1
                }
            };
        case types.ADD_NEWFEED:
            return {
                ...state,
                newfeed: [action.payload].concat(state.newfeed)
            };
        case types.ADD_USER_FOLLOW:
            return {
                ...state,
                user: {...state.user,
                    followings: state.user.followings ? state.user.followings.concat(action.payload) : undefined
                }
            };
        case types.DELETE_USER_FOLLOW:
        var list = state.user.followings;
        list.splice(action.payload, 1);
            return {
                ...state,
                user: {...state.user,
                    followings: list
                }
            };
        case types.GET_POST:
            return {
                ...state,
                tweets: action.payload
            };
        case types.ADD_POST:
            return {
                ...state,
                tweets: state.tweets ? action.payload.concat(state.tweets) : action.payload
            };
        case types.GET_NEWFEED:
        return {
            ...state,
            newfeed: action.payload
        };
        case types.LOGOUT:
            return {};
        default:
            return state;
    }
};
