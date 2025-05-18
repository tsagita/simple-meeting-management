package handlers

import (
	"backend/database"
	"backend/models"
	"backend/services"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func CreateMeeting(c *fiber.Ctx) error {
	type Request struct {
		Topic     string `json:"topic"`
		StartTime string `json:"start_time"`
	}

	var req Request
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error":   "Invalid request",
			"details": err.Error(),
		})
	}

	zoomData, err := services.CreateZoomMeeting(req.Topic, req.StartTime)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to create Zoom meeting",
			"details": err.Error(),
		})
	}

	zoomID := ""
	switch v := zoomData["id"].(type) {
	case string:
		zoomID = v
	case float64:
		zoomID = strconv.FormatInt(int64(v), 10)
	}

	meeting := models.Meeting{
		ZoomMeetingID: zoomID,
		Topic:         zoomData["topic"].(string),
		StartTime:     zoomData["start_time"].(string),
		JoinURL:       zoomData["join_url"].(string),
	}

	if err := database.DB.Create(&meeting).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to save meeting",
			"details": err.Error(),
		})
	}

	return c.JSON(meeting)
}

func GetMeetingList(c *fiber.Ctx) error {
	meetings, err := services.GetZoomMeetings()
	if err != nil {
		return c.Status(500).SendString("Gagal ambil data dari Zoom: " + err.Error())
	}

	if meetings == nil {
		return c.Status(404).SendString("Tidak ada meeting")
	}

	return c.JSON(meetings)
}

func GetMeetingFromDB(c *fiber.Ctx) error {
	var meetings []models.Meeting
	database.DB.Find(&meetings)
	return c.JSON(meetings)
}

func DeleteMeeting(c *fiber.Ctx) error {
	meetingID := c.Params("id")
	fmt.Print("meetingID", meetingID)
	if meetingID == "" {
		return c.Status(400).JSON(fiber.Map{
			"error": "Meeting ID is required",
		})
	}

	if err := services.DeleteZoomMeeting(meetingID); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to delete Zoom meeting",
			"details": err.Error(),
		})
	}

	return c.SendStatus(204)
}
