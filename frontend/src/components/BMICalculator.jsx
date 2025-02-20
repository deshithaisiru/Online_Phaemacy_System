import React, { useState } from 'react';

function BMICalculator() {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [message, setMessage] = useState('');

    const calculateBMI = (e) => {
        e.preventDefault();

        if (height === '' || weight === '') {
            setMessage('Please enter both height and weight.');
            return;
        }

        const heightInMeters = height / 100;
        const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);

        setBmi(calculatedBMI);

        if (calculatedBMI < 18.5) {
            setMessage('You are underweight.');
        } else if (calculatedBMI >= 18.5 && calculatedBMI < 24.9) {
            setMessage('You have a normal weight.');
        } else if (calculatedBMI >= 25 && calculatedBMI < 29.9) {
            setMessage('You are overweight.');
        } else {
            setMessage('You are obese.');
        }
    };

    const getBMIStatusColor = () => {
        if (!bmi) return 'text-gray-400';
        if (bmi < 18.5) return 'text-blue-400';
        if (bmi >= 18.5 && bmi < 24.9) return 'text-green-400';
        if (bmi >= 25 && bmi < 29.9) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className="w-full">
            <form onSubmit={calculateBMI} className="space-y-6">
                <div className="space-y-4">
                    <div className="group">
                        <label htmlFor="height" className="block text-sm text-gray-400 mb-2">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            id="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                            placeholder="Enter height in cm"
                        />
                    </div>

                    <div className="group">
                        <label htmlFor="weight" className="block text-sm text-gray-400 mb-2">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                            placeholder="Enter weight in kg"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-black"
                >
                    Calculate BMI
                </button>
            </form>

            {(bmi || message) && (
                <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    {bmi && (
                        <div className="text-center mb-4">
                            <div className="text-gray-400 mb-2">Your BMI</div>
                            <div className={`text-4xl font-bold ${getBMIStatusColor()}`}>
                                {bmi}
                            </div>
                        </div>
                    )}
                    {message && (
                        <div className="text-center">
                            <p className={`text-lg ${getBMIStatusColor()}`}>
                                {message}
                            </p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-4 gap-2 mt-6 text-xs text-center">
                        <div className="p-2 rounded bg-white/5 text-blue-400">
                            Underweight
                            <div className="mt-1 font-medium">&lt; 18.5</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 text-green-400">
                            Normal
                            <div className="mt-1 font-medium">18.5 - 24.9</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 text-orange-400">
                            Overweight
                            <div className="mt-1 font-medium">25 - 29.9</div>
                        </div>
                        <div className="p-2 rounded bg-white/5 text-red-400">
                            Obese
                            <div className="mt-1 font-medium">&gt; 30</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BMICalculator;