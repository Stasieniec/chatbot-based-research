import numpy as np
import matplotlib.pyplot as plt

def set_plot_style():
    plt.style.use('ggplot')
    plt.rcParams['font.sans-serif'] = ['Arial']
    plt.rcParams['font.family'] = 'sans-serif'

def generate_likert_data(size=300, loc=2, scale=1):
    np.random.seed(42)
    data = np.random.normal(loc=loc, scale=scale, size=size)
    return np.clip(data, 0, 4).round().astype(int)


def plot_likert_scale(data):
    set_plot_style()
    
    likert_options = ['Bardzo źle', 'Źle', 'Neutralnie', 'Dobrze', 'Bardzo dobrze']
    counts = [np.sum(data == i) for i in range(5)]

    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(likert_options, counts, color='#3498db', edgecolor='none', width=0.6)

    ax.set_xlabel('Opcje odpowiedzi', fontsize=12, labelpad=10)
    ax.set_ylabel('Liczba odpowiedzi', fontsize=12, labelpad=10)
    ax.tick_params(axis='both', which='major', labelsize=10)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height}',
                ha='center', va='bottom', fontsize=10)

    plt.tight_layout()
    plt.show()

def plot_gender_ratio(male_ratio=0.35, total_participants=1000):
    set_plot_style()

    male_count = int(total_participants * male_ratio)
    female_count = total_participants - male_count

    gender_sizes = [male_count, female_count]
    gender_labels = ['Posiada dzieci', 'Nie posiada dzieci']
    gender_colors = ['#3498db', '#e74c3c']

    fig, ax = plt.subplots(figsize=(8, 8))
    ax.pie(gender_sizes, labels=gender_labels, colors=gender_colors, autopct='%1.1f%%',
           startangle=90, wedgeprops=dict(width=0.3), textprops={'fontsize': 18, 'fontweight': 'bold'}, pctdistance=0.85)  # Adjusted textprops
    ax.axis('equal')

    plt.tight_layout()
    plt.show()

def plot_three_category_distribution(category_names, sizes, colors):
    set_plot_style()

    fig, ax = plt.subplots(figsize=(8, 8))
    ax.pie(sizes, labels=category_names, colors=colors, autopct='%1.1f%%',
           startangle=90, wedgeprops=dict(width=0.3), textprops={'fontsize': 18, 'fontweight': 'bold'}, pctdistance=0.85)  # Adjusted textprops
    ax.axis('equal')

    plt.tight_layout()
    plt.show()


def generate_integer_normal_data(size=300, mean=10, std_dev=4, zero_boost=20):
    np.random.seed(42)
    data = np.random.normal(loc=mean, scale=std_dev, size=size)
    data = np.maximum(0, np.round(data)).astype(int)
    
    # Add extra zeros
    #zeros = np.zeros(zero_boost, dtype=int)
    #data = np.concatenate((data, zeros))
    
    np.random.shuffle(data)
    return data

def plot_integer_distribution(data):
    set_plot_style()
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Calculate the range for the bins
    min_val, max_val = 0, max(data)
    bins = range(min_val, max_val + 2)  # +2 to include the max value
    
    counts, edges, _ = ax.hist(data, bins=bins, align='left', rwidth=0.8, color='#3498db', edgecolor='none')
    
    ax.set_xlabel('Wartość', fontsize=12, labelpad=10)
    ax.set_ylabel('Częstotliwość', fontsize=12, labelpad=10)
    ax.tick_params(axis='both', which='major', labelsize=10)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    
    plt.tight_layout()
    plt.show()



# Example usage:
# To generate Likert scale plot
# likert_data = generate_likert_data()
# plot_likert_scale(likert_data)

# To generate gender ratio plot
# plot_gender_ratio()

# To generate three-category distribution plot
category_names = ['Podstawowe', 'Średnie', 'Wyższe']
sizes = [38, 97, 165]  # Adjusted to sum up to 250
colors = ['#3498db', '#e74c3c', '#2ecc71']


plot_gender_ratio()
plot_three_category_distribution(category_names, sizes, colors)

#integer_data = generate_integer_normal_data(mean=5, std_dev=3)
#plot_integer_distribution(integer_data)

#likert_data = generate_likert_data()
#plot_likert_scale(likert_data)

#integer_data = generate_integer_normal_data(mean=98, std_dev=30, zero_boost=5)
#plot_integer_distribution(integer_data)