module.exports.successMessage = (statusCode, data) => {
	return { statusCode, data };
};

module.exports.errorMessage = (statusCode, message) => {
	return { statusCode, message };
};

module.exports.errorValidation = (statusCode, errors) => {
	return { statusCode, errors };
};
