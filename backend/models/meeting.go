package models

import "gorm.io/gorm"

type Meeting struct {
	gorm.Model
	ZoomMeetingID string
	Topic         string
	StartTime     string
	JoinURL       string
}
