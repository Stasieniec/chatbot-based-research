import numpy as np
import matplotlib.pyplot as plt

# Set random seed for reproducibility
np.random.seed(42)

# Define Likert scale options
likert_options = ['Bardzo zła', 'Zła', 'Neutralna', 'Dobra', 'Wspaniałą']

# Generate normally distributed data
data = np.random.normal(loc=3, scale=1, size=1000)
data = np.clip(data, 0, 4).round().astype(int)

# Count occurrences of each option
counts = [np.sum(data == i) for i in range(5)]

# Create bar plot
plt.figure(figsize=(10, 6))
bars = plt.bar(likert_options, counts, color='skyblue', edgecolor='navy')

# Customize the plot
plt.title('Jakość komunikacji miejskiej', fontsize=16)
plt.xlabel('Jakość komunikacji miejskiej', fontsize=12)
plt.ylabel('Ilość głosów', fontsize=12)
plt.ylim(0, max(counts) * 1.1)  # Set y-axis limit with some padding

# Add value labels on top of each bar
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}',
             ha='center', va='bottom')

# Adjust layout and display the plot
plt.tight_layout()
plt.show()