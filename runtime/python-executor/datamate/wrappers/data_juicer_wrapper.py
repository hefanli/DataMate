# -*- coding: utf-8 -*-
from datamate.scheduler import cmd_scheduler


async def submit(task_id, config_path):
    await cmd_scheduler.submit(task_id, f"dj-process --config {config_path}")