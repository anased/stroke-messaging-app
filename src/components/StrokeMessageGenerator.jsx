import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './textarea';

const StrokeMessageGenerator = () => {
  // State for basic patient info
  const [basicInfo, setBasicInfo] = useState({
    history: '',
    complaint: '',
    lastKnownWell: '',
  });

  // State for NIHSS components
  const [nihss, setNihss] = useState({
    loc: '',
    locQuestions: '',
    locCommands: '',
    gaze: '',
    visual: '',
    facial: '',
    leftArm: '',
    rightArm: '',
    leftLeg: '',
    rightLeg: '',
    ataxia: '',
    sensory: '',
    language: '',
    dysarthria: '',
    extinction: ''
  });

  // State for contraindications
  const [contraindications, setContraindications] = useState({
    activeBleed: false,
    recentSurgery: false,
    recentTrauma: false,
    recentStroke: false,
    uncontrolledBP: false,
    coagulopathy: false,
    plateletCount: false,
    bloodSugar: false
  });

  // State for mRS
  const [mrsScore, setMrsScore] = useState('');

  // State for generated message
  const [generatedMessage, setGeneratedMessage] = useState('');

  const calculateNihssTotal = () => {
    const scores = Object.values(nihss).map(score => parseInt(score) || 0);
    return scores.reduce((a, b) => a + b, 0);
  };

  const generateMessage = () => {
    const nihssTotal = calculateNihssTotal();
    
    const message = `STROKE ALERT ASSESSMENT
    
History: ${basicInfo.history}
Chief Complaint: ${basicInfo.complaint}
Last Known Well: ${basicInfo.lastKnownWell}

NIHSS Total Score: ${nihssTotal}
- LOC: ${nihss.loc}
- LOC Questions: ${nihss.locQuestions}
- LOC Commands: ${nihss.locCommands}
- Gaze: ${nihss.gaze}
- Visual Fields: ${nihss.visual}
- Facial Palsy: ${nihss.facial}
- Left Arm: ${nihss.leftArm}
- Right Arm: ${nihss.rightArm}
- Left Leg: ${nihss.leftLeg}
- Right Leg: ${nihss.rightLeg}
- Limb Ataxia: ${nihss.ataxia}
- Sensory: ${nihss.sensory}
- Language: ${nihss.language}
- Dysarthria: ${nihss.dysarthria}
- Extinction/Inattention: ${nihss.extinction}

Pre-treatment mRS: ${mrsScore}

Contraindications Present:
${Object.entries(contraindications)
  .filter(([_, value]) => value)
  .map(([key]) => `- ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
  .join('\n')}`;

    setGeneratedMessage(message);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stroke Assessment Message Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Basic Information Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="space-y-2">
              <Label htmlFor="history">Brief History</Label>
              <Textarea
                id="history"
                value={basicInfo.history}
                onChange={(e) => setBasicInfo({...basicInfo, history: e.target.value})}
                placeholder="Enter brief history"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complaint">Acute Neurological Complaint</Label>
              <Textarea
                id="complaint"
                value={basicInfo.complaint}
                onChange={(e) => setBasicInfo({...basicInfo, complaint: e.target.value})}
                placeholder="Enter chief complaint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastKnownWell">Last Known Well</Label>
              <Input
                id="lastKnownWell"
                value={basicInfo.lastKnownWell}
                onChange={(e) => setBasicInfo({...basicInfo, lastKnownWell: e.target.value})}
                placeholder="Enter last known well time"
              />
            </div>
          </div>

          {/* NIHSS Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">NIHSS Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(nihss).map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + 
                     key.replace(/([A-Z])/g, ' $1').slice(1)}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    min="0"
                    max="4"
                    value={nihss[key]}
                    onChange={(e) => setNihss({...nihss, [key]: e.target.value})}
                    placeholder="Score"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contraindications Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">TNK/TPA Contraindications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(contraindications).map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={key}
                    checked={contraindications[key]}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      [key]: e.target.checked
                    })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + 
                     key.replace(/([A-Z])/g, ' $1').slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* mRS Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Modified Rankin Scale</h3>
            <div className="space-y-2">
              <Label htmlFor="mrs">Pre-treatment mRS Score</Label>
              <Input
                id="mrs"
                type="number"
                min="0"
                max="6"
                value={mrsScore}
                onChange={(e) => setMrsScore(e.target.value)}
                placeholder="Enter mRS score"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateMessage}
            className="w-full mt-4"
          >
            Generate Message
          </Button>

          {/* Generated Message */}
          {generatedMessage && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Generated Message</h3>
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                {generatedMessage}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrokeMessageGenerator;