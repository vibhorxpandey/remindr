"""
Per-user adaptive pattern learning using the custom neural network.
Learns when a user is most likely to complete different types of tasks.
"""
import numpy as np
from datetime import datetime
from typing import Optional
from ml.neural_network import NeuralNetwork

CATEGORIES = ["work", "personal", "health", "finance", "social", "other"]

# Network architecture: 13 input features → 32 → 16 → 1 output (completion probability)
DEFAULT_LAYER_SIZES = [13, 32, 16, 1]


def _build_features(
    hour: int,
    dow: int,
    priority: int,
    category: str,
    days_until_due: Optional[float],
    reminders_sent: int,
) -> np.ndarray:
    """
    Encode a task context into a 13-dimensional feature vector.
    Uses cyclical encoding for time to preserve periodicity.
    """
    # Cyclical time encodings
    hour_sin = np.sin(2 * np.pi * hour / 24)
    hour_cos = np.cos(2 * np.pi * hour / 24)
    dow_sin = np.sin(2 * np.pi * dow / 7)
    dow_cos = np.cos(2 * np.pi * dow / 7)

    # Normalized priority (1-3 → 0.33-1.0)
    priority_norm = priority / 3.0

    # One-hot category encoding (6 categories)
    cat_vec = [1.0 if category == c else 0.0 for c in CATEGORIES]

    # Days until due: cap at 30 days, normalize; None → assume 7 days
    due = days_until_due if days_until_due is not None else 7.0
    due_norm = min(max(due, 0.0), 30.0) / 30.0

    # Reminders sent: cap at 10, normalize
    rem_norm = min(reminders_sent, 10) / 10.0

    # Assemble: 4 time + 1 priority + 6 category + 1 due + 1 reminders = 13
    features = [hour_sin, hour_cos, dow_sin, dow_cos, priority_norm] + cat_vec + [due_norm, rem_norm]
    return np.array(features, dtype=np.float64).reshape(1, -1)


class PatternLearner:
    """
    Wraps the neural network with task-specific feature extraction and training logic.
    One instance per user; weights are loaded/saved from the database.
    """

    def __init__(self, nn_json: Optional[str] = None):
        if nn_json:
            self.nn = NeuralNetwork.from_json(nn_json)
        else:
            self.nn = NeuralNetwork(DEFAULT_LAYER_SIZES, learning_rate=0.005)

    def predict(
        self,
        hour: int,
        dow: int,
        priority: int,
        category: str,
        days_until_due: Optional[float],
        reminders_sent: int = 0,
    ) -> float:
        """Returns completion probability [0, 1] for the given context."""
        X = _build_features(hour, dow, priority, category, days_until_due, reminders_sent)
        prob = self.nn.predict(X)
        return float(np.clip(prob[0, 0], 0.0, 1.0))

    def update(
        self,
        hour: int,
        dow: int,
        priority: int,
        category: str,
        days_until_due: Optional[float],
        completed: bool,
        reminders_sent: int = 0,
        epochs: int = 30,
    ) -> float:
        """Online update: train on a single observation. Returns final loss."""
        X = _build_features(hour, dow, priority, category, days_until_due, reminders_sent)
        y = np.array([[1.0 if completed else 0.0]])
        return self.nn.fit(X, y, epochs=epochs)

    def batch_update(self, samples: list, epochs: int = 100) -> float:
        """
        Batch retrain on historical data.
        Each sample: dict with keys hour, dow, priority, category, days_until_due,
                      reminders_sent, completed.
        """
        if not samples:
            return 0.0
        X_rows = []
        y_rows = []
        for s in samples:
            row = _build_features(
                s["hour"], s["dow"], s["priority"], s["category"],
                s.get("days_until_due"), s.get("reminders_sent", 0)
            )
            X_rows.append(row)
            y_rows.append([1.0 if s["completed"] else 0.0])
        X = np.vstack(X_rows)
        y = np.array(y_rows)
        return self.nn.fit(X, y, epochs=epochs)

    def best_reminder_hour(self, dow: int, priority: int, category: str) -> int:
        """Scan all 24 hours and return the one with highest predicted completion probability."""
        best_hour, best_prob = 9, 0.0
        for h in range(24):
            prob = self.predict(h, dow, priority, category, days_until_due=1.0)
            if prob > best_prob:
                best_prob = prob
                best_hour = h
        return best_hour

    def to_json(self) -> str:
        return self.nn.to_json()
