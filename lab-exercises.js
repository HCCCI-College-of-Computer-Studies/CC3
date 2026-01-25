const exercises = {
    hello: {
        instructions: "Write a program that prints \"Hello, World!\" to the console.",
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
    },
    variables: {
        instructions: "Create variables of different data types (int, double, String, boolean) and print their values.",
        code: `public class Main {
    public static void main(String[] args) {
        int age = 20;
        double gpa = 3.75;
        String name = "Student";
        boolean isEnrolled = true;
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        System.out.println("Enrolled: " + isEnrolled);
    }
}`
    },
    conditionals: {
        instructions: "Write a program that checks if a number is positive, negative, or zero using if-else statements.",
        code: `public class Main {
    public static void main(String[] args) {
        int number = 10;
        
        if (number > 0) {
            System.out.println(number + " is positive");
        } else if (number < 0) {
            System.out.println(number + " is negative");
        } else {
            System.out.println("The number is zero");
        }
    }
}`
    },
    loops: {
        instructions: "Write a program that prints numbers 1 to 10 using a for loop, then prints even numbers from 2 to 10 using a while loop.",
        code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Numbers 1 to 10:");
        for (int i = 1; i <= 10; i++) {
            System.out.print(i + " ");
        }
        System.out.println();
        
        System.out.println("Even numbers 2 to 10:");
        int num = 2;
        while (num <= 10) {
            System.out.print(num + " ");
            num += 2;
        }
    }
}`
    },
    arrays: {
        instructions: "Create an array of 5 integers, populate it with values, and calculate the sum and average.",
        code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};
        int sum = 0;
        
        System.out.println("Array elements:");
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("numbers[" + i + "] = " + numbers[i]);
            sum += numbers[i];
        }
        
        double average = (double) sum / numbers.length;
        System.out.println("Sum: " + sum);
        System.out.println("Average: " + average);
    }
}`
    },
    classes: {
        instructions: "Create a Student class with name and grade properties, a constructor, and a method to display student info.",
        code: `class Student {
    String name;
    int grade;
    
    public Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }
    
    public void displayInfo() {
        System.out.println("Name: " + name);
        System.out.println("Grade: " + grade);
    }
}

public class Main {
    public static void main(String[] args) {
        Student student1 = new Student("Alice", 90);
        Student student2 = new Student("Bob", 85);
        
        System.out.println("Student 1:");
        student1.displayInfo();
        System.out.println();
        System.out.println("Student 2:");
        student2.displayInfo();
    }
}`
    },
    inheritance: {
        instructions: "Create an Animal base class and a Dog subclass that extends it. Demonstrate inheritance and method overriding.",
        code: `class Animal {
    String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void makeSound() {
        System.out.println("Some generic sound");
    }
}

class Dog extends Animal {
    String breed;
    
    public Dog(String name, String breed) {
        super(name);
        this.breed = breed;
    }
    
    @Override
    public void makeSound() {
        System.out.println("Woof! Woof!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal animal = new Animal("Generic");
        Dog dog = new Dog("Buddy", "Golden Retriever");
        
        System.out.println("Animal: " + animal.name);
        animal.makeSound();
        
        System.out.println("Dog: " + dog.name + " (" + dog.breed + ")");
        dog.makeSound();
    }
}`
    }
};

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const exerciseSelect = document.getElementById('exerciseSelect');
const instructionsEl = document.getElementById('instructions');
const sampleCodeEl = document.getElementById('sampleCode');
const copyCodeBtn = document.getElementById('copyCode');

// Tab switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId + '-tab').classList.add('active');
    });
});

// Load exercise
function loadExercise(exerciseKey) {
    const exercise = exercises[exerciseKey];
    if (exercise) {
        instructionsEl.textContent = exercise.instructions;
        sampleCodeEl.innerHTML = '<code>' + escapeHtml(exercise.code) + '</code>';
    }
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Copy code to clipboard
copyCodeBtn.addEventListener('click', () => {
    const exerciseKey = exerciseSelect.value;
    const code = exercises[exerciseKey].code;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = copyCodeBtn.textContent;
        copyCodeBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyCodeBtn.textContent = originalText;
        }, 2000);
        
        // Switch to compiler tab
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="compiler"]').classList.add('active');
        document.getElementById('compiler-tab').classList.add('active');
    }).catch(() => {
        alert('Please manually copy the code above');
    });
});

// Exercise selector
exerciseSelect.addEventListener('change', (e) => {
    loadExercise(e.target.value);
});

// Initialize
loadExercise('hello');
