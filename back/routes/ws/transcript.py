from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
import json
import asyncio
import time

from back.utils.sentenceEnhancer import enhance
from back.db.messages import putMessage

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws/transcript")
async def websocket_transcript(websocket: WebSocket, meetID: str | None = None):
    await websocket.accept()
    logger.info("WebSocket connection established")
    if meetID:
        logger.info(f"WebSocket connected with meetID={meetID}")
    else:
        logger.info("WebSocket connected without meetID; will accept meetID from incoming messages if provided")

    last_transcript = ""
    last_time = 0
    ENHANCE_DELAY = 0.8  # seconds
    enhance_task = None

    try:
        print("\n" + "="*50)
        print("Interview session started - Listening for transcriptions...")
        print("="*50 + "\n")

        while True:
            data = await websocket.receive_text()

            try:
                message = json.loads(data)

                if message.get("type") == "interim" and message.get("text"):
                    interim = message["text"].strip()
                    if interim:
                        print(f"[USER - interim]: {interim}", flush=True)

                # If client provided meetID in payload, capture it (useful if query param was not supplied)
                if message.get("meetID") and not meetID:
                    meetID = message.get("meetID")
                    logger.info(f"Received meetID from client message: {meetID}")

                if message.get("type") == "transcript" and message.get("text"):
                    transcript = message["text"].strip()
                    if not transcript:
                        continue

                    print(f"[USER]: {transcript}", flush=True)

                    last_transcript = transcript
                    last_time = time.time()

                    # Cancel previous pending enhance task
                    if enhance_task and not enhance_task.done():
                        enhance_task.cancel()

                    # Schedule new enhance
                    async def delayed_enhance(text_snapshot):
                        try:
                            await asyncio.sleep(ENHANCE_DELAY)

                            # If no newer transcript came in meantime
                            if text_snapshot == last_transcript:
                                newS = enhance(text_snapshot)
                                print(f"[ENHANCED]: {newS}", flush=True)
                                if meetID:
                                    putMessage(meetID, "user", newS)
                                else:
                                    logger.warning("No meetID available; skipping DB insert for message")

                        except asyncio.CancelledError:
                            pass

                    enhance_task = asyncio.create_task(delayed_enhance(transcript))

            # except json.JSONDecodeError:
            #     if data.strip():
            #         print(f"[USER]: {data.strip()}", flush=True)

            except Exception as e:
                logger.warning(f"Error processing message: {e}")

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
        print("\n" + "="*50)
        print("Interview session ended")
        print("="*50 + "\n")

    except Exception as e:
        logger.error(f"Error in WebSocket connection: {e}", exc_info=True)
        try:
            await websocket.close()
        except:
            pass
