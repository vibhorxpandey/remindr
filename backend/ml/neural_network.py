"""
Custom MLP neural network using only numpy.
Per-user adaptive model for task completion prediction.
"""
import numpy as np
import json
from typing import List, Tuple


class NeuralNetwork:
    """
    Multi-layer perceptron with ReLU hidden activations and sigmoid output.
    Supports serialization to/from JSON for database storage.
    """

    def __init__(self, layer_sizes: List[int], learning_rate: float = 0.005):
        self.layer_sizes = layer_sizes
        self.lr = learning_rate
        self.weights: List[np.ndarray] = []
        self.biases: List[np.ndarray] = []
        self._initialize_weights()

    def _initialize_weights(self):
        """He initialization for ReLU layers."""
        for i in range(len(self.layer_sizes) - 1):
            fan_in = self.layer_sizes[i]
            w = np.random.randn(fan_in, self.layer_sizes[i + 1]) * np.sqrt(2.0 / fan_in)
            b = np.zeros((1, self.layer_sizes[i + 1]))
            self.weights.append(w)
            self.biases.append(b)

    # --- Activations ---

    def _relu(self, x: np.ndarray) -> np.ndarray:
        return np.maximum(0.0, x)

    def _relu_grad(self, x: np.ndarray) -> np.ndarray:
        return (x > 0).astype(np.float64)

    def _sigmoid(self, x: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(x, -500, 500)))

    # --- Forward pass ---

    def forward(self, X: np.ndarray) -> Tuple[List[np.ndarray], List[np.ndarray]]:
        """Returns (pre-activations z, activations a) for each layer."""
        zs, acts = [], [X]
        current = X
        for i, (w, b) in enumerate(zip(self.weights, self.biases)):
            z = current @ w + b
            zs.append(z)
            if i < len(self.weights) - 1:
                current = self._relu(z)
            else:
                current = self._sigmoid(z)
            acts.append(current)
        return zs, acts

    def predict(self, X: np.ndarray) -> np.ndarray:
        _, acts = self.forward(X)
        return acts[-1]

    # --- Backpropagation ---

    def _binary_cross_entropy(self, y_pred: np.ndarray, y_true: np.ndarray) -> float:
        eps = 1e-7
        return -np.mean(y_true * np.log(y_pred + eps) + (1 - y_true) * np.log(1 - y_pred + eps))

    def train_step(self, X: np.ndarray, y: np.ndarray) -> float:
        """Single gradient descent step. Returns loss."""
        m = X.shape[0]
        zs, acts = self.forward(X)

        # Output delta (sigmoid + BCE gradient simplifies nicely)
        delta = acts[-1] - y  # (m, 1)
        loss = self._binary_cross_entropy(acts[-1], y)

        deltas = [None] * len(self.weights)
        deltas[-1] = delta

        # Backpropagate through hidden layers
        # zs[i] is the pre-activation for weight layer i
        for i in range(len(self.weights) - 2, -1, -1):
            delta = (deltas[i + 1] @ self.weights[i + 1].T) * self._relu_grad(zs[i])
            deltas[i] = delta

        # Update weights with gradient descent
        for i in range(len(self.weights)):
            grad_w = (acts[i].T @ deltas[i]) / m
            grad_b = np.mean(deltas[i], axis=0, keepdims=True)
            self.weights[i] -= self.lr * grad_w
            self.biases[i] -= self.lr * grad_b

        return float(loss)

    def fit(self, X: np.ndarray, y: np.ndarray, epochs: int = 50) -> float:
        """Train for multiple epochs, return final loss."""
        loss = 0.0
        for _ in range(epochs):
            loss = self.train_step(X, y)
        return loss

    # --- Serialization ---

    def to_json(self) -> str:
        data = {
            "layer_sizes": self.layer_sizes,
            "lr": self.lr,
            "weights": [w.tolist() for w in self.weights],
            "biases": [b.tolist() for b in self.biases],
        }
        return json.dumps(data)

    @classmethod
    def from_json(cls, json_str: str) -> "NeuralNetwork":
        data = json.loads(json_str)
        nn = cls(data["layer_sizes"], data.get("lr", 0.005))
        nn.weights = [np.array(w) for w in data["weights"]]
        nn.biases = [np.array(b) for b in data["biases"]]
        return nn
