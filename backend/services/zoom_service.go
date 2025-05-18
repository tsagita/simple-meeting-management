package services

import (
	"encoding/base64"
	"encoding/json"
	"fmt"

	"github.com/go-resty/resty/v2"
)

var clientId = "PS3sJ_2DSpyJEy17uFIhaQ"
var clientSecret = "Y3wSic1e3jb0oJkB4j776kFLXfZQcHc0"
var accountId = "iUQwMplgT4GI7gDK6rdEgQ"

func GetAccessToken() (string, error) {
	auth := base64.StdEncoding.EncodeToString([]byte(clientId + ":" + clientSecret))

	fmt.Print("client ID", clientId)

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Basic "+auth).
		SetHeader("Content-Type", "application/x-www-form-urlencoded").
		SetFormData(map[string]string{
			"grant_type": "account_credentials",
			"account_id": accountId,
		}).
		Post("https://zoom.us/oauth/token")

	if err != nil {
		return "", err
	}

	var result map[string]interface{}
	json.Unmarshal(resp.Body(), &result)

	token := fmt.Sprint(result["access_token"])
	return token, nil
}

func CreateZoomMeeting(topic, startTime string) (map[string]interface{}, error) {
	token, err := GetAccessToken()
	if err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"topic":      topic,
		"type":       2, // Scheduled meeting
		"start_time": startTime,
		"timezone":   "Asia/Jakarta",
		"settings": map[string]interface{}{
			"host_video":        true,
			"participant_video": true,
			"join_before_host":  false,
		},
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+token).
		SetHeader("Content-Type", "application/json").
		SetBody(body).
		Post("https://api.zoom.us/v2/users/me/meetings")

	if err != nil {
		return nil, err
	}

	var data map[string]interface{}
	json.Unmarshal(resp.Body(), &data)
	return data, nil
}

func GetZoomMeetings() ([]interface{}, error) {
	token, err := GetAccessToken()
	if err != nil {
		return nil, err
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+token).
		Get("https://api.zoom.us/v2/users/me/meetings")

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != 200 {
		return nil, fmt.Errorf("Zoom API returned error: %s", resp.Status())
	}

	fmt.Printf("Response Body: %s\n", resp.Body())

	var result map[string]interface{}
	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return nil, err
	}

	if meetingsData, exists := result["meetings"]; exists {
		if meetings, ok := meetingsData.([]interface{}); ok && len(meetings) > 0 {
			return meetings, nil
		}
		return nil, nil
	}

	return nil, fmt.Errorf("Invalid response format: meetings not found")
}

func DeleteZoomMeeting(meetingID string) error {
	token, err := GetAccessToken()
	if err != nil {
		return fmt.Errorf("failed to get access token: %w", err)
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+token).
		Delete("https://api.zoom.us/v2/meetings/" + meetingID)

	if err != nil {
		return fmt.Errorf("zoom API request failed: %w", err)
	}

	if resp.StatusCode() != 204 {
		return fmt.Errorf("zoom API error: %s - %s", resp.Status(), resp.Body())
	}

	return nil
}
