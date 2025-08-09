export const userApiResponse = {
	"id": "string",
	"createdAt": "string",
	"updatedAt": "string",
	"email": "string",
	"password": null,
	"name": "string",
	"picture": "string",
	"filter_enabled": false,
	"product": "FREE",
	"playlists": [],
	"playlistsLiked": [],
	"tracksLiked": []
}

export const playlistApiResponse = {
	"id": "string",
	"createdAt": "string",
	"updatedAt": "string",
	"name": "string",
	"userId": "string",
	"tracks": []
}

export const trackApiResponse = {
	"id": "string",
	"createdAt": "string",
	"updatedAt": "string",
	"name": "string",
	"url": "string",
	"playlistId": "string"
}

export const authApiResponse = {
	"accessToken": "string",
	user: userApiResponse,
}
