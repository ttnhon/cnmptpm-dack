const initState = {
	users: [
		{name: 'Mert S. Kaplan', 
		id: 'mertskaplan', 
		tweets: '9.840', 
		following: '885', 
		followers: '1.810',
		url: 'https://twitter.com/mertskaplan',
		avtUrl: 'https://mertskaplan.com/wp-content/plugins/msk-twprofilecard/img/mertskaplan.jpg'},

		{name: 'Mert S. Kaplan', 
		id: 'mertskaplan', 
		tweets: '9.840', 
		following: '885', 
		followers: '1.810',
		url: 'https://twitter.com/mertskaplan',
		avtUrl: 'https://mertskaplan.com/wp-content/plugins/msk-twprofilecard/img/mertskaplan.jpg'},

		{name: 'Mert S. Kaplan', 
		id: 'mertskaplan', 
		tweets: '9.840', 
		following: '885', 
		followers: '1.810',
		url: 'https://twitter.com/mertskaplan',
		avtUrl: 'https://mertskaplan.com/wp-content/plugins/msk-twprofilecard/img/mertskaplan.jpg'}
	]
};

const followingReducer = (state = initState, action) => {
	return state;
};

export default followingReducer;