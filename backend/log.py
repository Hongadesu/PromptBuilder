import logging
from datetime import datetime, timezone

from info import BASE_DIR


# logging Settings
class Logger:
    @staticmethod
    def init_log():
        now = datetime.now(timezone.utc)
        log_filename = now.strftime("app_%Y-%m-%d.log")
        LOG_PATH = BASE_DIR / log_filename

        Logger.clear_old_logs(now)

        # 建立 logger
        logger = logging.getLogger("server")
        logger.setLevel(logging.DEBUG)

        # 建立檔案處理器，指定 encoding 為 utf-8
        file_handler = logging.FileHandler(LOG_PATH, encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)

        # 設置格式
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        file_handler.setFormatter(formatter)

        # 加入 handler
        logger.addHandler(file_handler)

        # 啟動時輸出
        timestamp = now.strftime("%Y-%m-%d 的 %H:%M:%S")
        logger.info(f"程序於 {timestamp} 啟動")

    @staticmethod
    def clear_old_logs(now: datetime):
        """
        給定當前時間的年月日 ，先掃描當前 log 文件存放路徑，將超過 7 天的 log 名稱的
        log 文件進行清除
        """
        EXPIRE_DAYS = 7
        base_dir = BASE_DIR

        for file in base_dir.iterdir():
            if (
                file.is_file()
                and file.name.startswith("app_")
                and file.suffix == ".log"
            ):
                # 從檔名中擷取日期字串：app_2025-07-14.log → 2025-07-14
                date_str = file.stem.replace("app_", "")
                file_date = datetime.strptime(date_str, "%Y-%m-%d").replace(
                    tzinfo=timezone.utc
                )

                if (now - file_date).days > EXPIRE_DAYS:
                    file.unlink()  # 刪除檔案
                    logger = logging.getLogger("server")
                    logger.info(f"已刪除過期的 log 文件: {file.name}")

    @staticmethod
    def get_logger():
        return logging.getLogger("server")
