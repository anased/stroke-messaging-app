import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Label } from './ui/label.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Select } from './ui/select.jsx';

// NIHSS scoring options based on the official NIHSS scale
const nihssOptions = {
  loc: [
    { value: "0", label: "0 - Alert" },
    { value: "1", label: "1 - Not alert, arousable with minimal stimulation" },
    { value: "2", label: "2 - Not alert, requires repeated stimulation" },
    { value: "3", label: "3 - Unresponsive or responds only with reflex" }
  ],
  locQuestions: [
    { value: "0", label: "0 - Answers both correctly" },
    { value: "1", label: "1 - Answers one correctly" },
    { value: "2", label: "2 - Answers neither correctly" }
  ],
  locCommands: [
    { value: "0", label: "0 - Performs both tasks correctly" },
    { value: "1", label: "1 - Performs one task correctly" },
    { value: "2", label: "2 - Performs neither task correctly" }
  ],
  gaze: [
    { value: "0", label: "0 - Normal horizontal movements" },
    { value: "1", label: "1 - Partial gaze palsy" },
    { value: "2", label: "2 - Forced deviation/total gaze paresis" }
  ],
  visual: [
    { value: "0", label: "0 - No visual field defect" },
    { value: "1", label: "1 - Partial hemianopia" },
    { value: "2", label: "2 - Complete hemianopia" },
    { value: "3", label: "3 - Bilateral hemianopia/blind" }
  ],
  facial: [
    { value: "0", label: "0 - Normal" },
    { value: "1", label: "1 - Minor facial weakness" },
    { value: "2", label: "2 - Partial facial weakness" },
    { value: "3", label: "3 - Complete unilateral palsy" }
  ],
  leftArm: [
    { value: "0", label: "0 - No drift for 10 seconds" },
    { value: "1", label: "1 - Drift before 10 seconds" },
    { value: "2", label: "2 - Falls before 10 seconds" },
    { value: "3", label: "3 - No effort against gravity" },
    { value: "4", label: "4 - No movement" },
    { value: "UN", label: "UN - Untestable (amputation, joint fusion)" }
  ],
  rightArm: [
    { value: "0", label: "0 - No drift for 10 seconds" },
    { value: "1", label: "1 - Drift before 10 seconds" },
    { value: "2", label: "2 - Falls before 10 seconds" },
    { value: "3", label: "3 - No effort against gravity" },
    { value: "4", label: "4 - No movement" },
    { value: "UN", label: "UN - Untestable (amputation, joint fusion)" }
  ],
  leftLeg: [
    { value: "0", label: "0 - No drift for 5 seconds" },
    { value: "1", label: "1 - Drift before 5 seconds" },
    { value: "2", label: "2 - Falls before 5 seconds" },
    { value: "3", label: "3 - No effort against gravity" },
    { value: "4", label: "4 - No movement" },
    { value: "UN", label: "UN - Untestable (amputation, joint fusion)" }
  ],
  rightLeg: [
    { value: "0", label: "0 - No drift for 5 seconds" },
    { value: "1", label: "1 - Drift before 5 seconds" },
    { value: "2", label: "2 - Falls before 5 seconds" },
    { value: "3", label: "3 - No effort against gravity" },
    { value: "4", label: "4 - No movement" },
    { value: "UN", label: "UN - Untestable (amputation, joint fusion)" }
  ],
  ataxia: [
    { value: "0", label: "0 - Absent" },
    { value: "1", label: "1 - Present in one limb" },
    { value: "2", label: "2 - Present in two or more limbs" },
    { value: "UN", label: "UN - Untestable" }
  ],
  sensory: [
    { value: "0", label: "0 - Normal sensation" },
    { value: "1", label: "1 - Mild-to-moderate sensory loss" },
    { value: "2", label: "2 - Severe or total sensory loss" }
  ],
  language: [
    { value: "0", label: "0 - No aphasia" },
    { value: "1", label: "1 - Mild-to-moderate aphasia" },
    { value: "2", label: "2 - Severe aphasia" },
    { value: "3", label: "3 - Mute/global aphasia" }
  ],
  dysarthria: [
    { value: "0", label: "0 - Normal articulation" },
    { value: "1", label: "1 - Mild-to-moderate slurring" },
    { value: "2", label: "2 - Near unintelligible or worse" },
    { value: "UN", label: "UN - Intubated or other physical barrier" }
  ],
  extinction: [
    { value: "0", label: "0 - No neglect" },
    { value: "1", label: "1 - Partial neglect" },
    { value: "2", label: "2 - Complete neglect" }
  ]
};

// Modified Rankin Scale options
const mrsOptions = [
  { value: "0", label: "0 - No symptoms" },
  { value: "1", label: "1 - No significant disability" },
  { value: "2", label: "2 - Slight disability" },
  { value: "3", label: "3 - Moderate disability" },
  { value: "4", label: "4 - Moderately severe disability" },
  { value: "5", label: "5 - Severe disability" },
  { value: "6", label: "6 - Dead" }
];

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

  // State for contraindications organized by clinical categories
  const [contraindications, setContraindications] = useState({
    // Patient History
    strokeOrTrauma3m: false,
    previousICH: false,
    intracranialNeoplasm: false,
    giMalignancy: false,
    giHemorrhage21d: false,
    cranialSurgery3m: false,
    
    // Clinical
    elevatedBP: false,
    activeInternalBleeding: false,
    infectiveEndocarditis: false,
    aorticDissection: false,
    
    // Hematologic
    plateletUnder100k: false,
    anticoagulantWithElevatedINR: false,
    lmwhPast24h: false,
    doac48h: false,
    
    // Head CT
    evidenceOfHemorrhage: false,
    extensiveHypodensity: false
  });

  // State for mRS
  const [mrsScore, setMrsScore] = useState('');

  // State for generated message
  const [generatedMessage, setGeneratedMessage] = useState('');

  const calculateNihssTotal = () => {
    // Filter out any "UN" (untestable) values
    const scores = Object.entries(nihss)
      .filter(([_, value]) => value !== 'UN' && value !== '')
      .map(([_, value]) => parseInt(value) || 0);
    
    return scores.reduce((a, b) => a + b, 0);
  };

  const generateMessage = () => {
    const nihssTotal = calculateNihssTotal();
    
    // Format the NIHSS scores, handling untestable values
    const formatNihssValue = (value) => {
      return value === 'UN' ? 'Untestable' : value;
    };
    
    const message = `STROKE ALERT ASSESSMENT
    
History: ${basicInfo.history}
Chief Complaint: ${basicInfo.complaint}
Last Known Well: ${basicInfo.lastKnownWell}

NIHSS Total Score: ${nihssTotal}
- LOC: ${formatNihssValue(nihss.loc)}
- LOC Questions: ${formatNihssValue(nihss.locQuestions)}
- LOC Commands: ${formatNihssValue(nihss.locCommands)}
- Gaze: ${formatNihssValue(nihss.gaze)}
- Visual Fields: ${formatNihssValue(nihss.visual)}
- Facial Palsy: ${formatNihssValue(nihss.facial)}
- Left Arm: ${formatNihssValue(nihss.leftArm)}
- Right Arm: ${formatNihssValue(nihss.rightArm)}
- Left Leg: ${formatNihssValue(nihss.leftLeg)}
- Right Leg: ${formatNihssValue(nihss.rightLeg)}
- Limb Ataxia: ${formatNihssValue(nihss.ataxia)}
- Sensory: ${formatNihssValue(nihss.sensory)}
- Language: ${formatNihssValue(nihss.language)}
- Dysarthria: ${formatNihssValue(nihss.dysarthria)}
- Extinction/Inattention: ${formatNihssValue(nihss.extinction)}

Pre-treatment mRS: ${mrsScore}

Contraindications Present:
${Object.entries(contraindications)
  .filter(([_, value]) => value)
  .map(([key]) => {
    // Create more readable contraindication descriptions
    const labels = {
      // Patient History
      strokeOrTrauma3m: "Ischemic stroke or severe head trauma in previous 3 months",
      previousICH: "Previous intracranial hemorrhage",
      intracranialNeoplasm: "Intra-axial intracranial neoplasm",
      giMalignancy: "Gastrointestinal malignancy",
      giHemorrhage21d: "Gastrointestinal hemorrhage in previous 21 days",
      cranialSurgery3m: "Intracranial/intraspinal surgery within prior 3 months",
      
      // Clinical
      elevatedBP: "Persistent BP elevation (systolic ≥185 mmHg or diastolic ≥110 mmHg)",
      activeInternalBleeding: "Active internal bleeding",
      infectiveEndocarditis: "Presentation consistent with infective endocarditis",
      aorticDissection: "Stroke associated with aortic arch dissection",
      
      // Hematologic
      plateletUnder100k: "Platelet count <100,000/mm3",
      anticoagulantWithElevatedINR: "Anticoagulant use with elevated INR/PT/aPTT",
      lmwhPast24h: "Therapeutic doses of LMWH within 24 hours",
      doac48h: "Direct thrombin/factor Xa inhibitor within 48 hours",
      
      // Head CT
      evidenceOfHemorrhage: "Evidence of hemorrhage on head CT",
      extensiveHypodensity: "Extensive regions of obvious hypodensity"
    };
    
    return `- ${labels[key] || key.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
  })
  .join('\n') || "None"}`;

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
                  <Select
                    id={key}
                    value={nihss[key]}
                    options={nihssOptions[key]}
                    onChange={(e) => setNihss({...nihss, [key]: e.target.value})}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contraindications Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">TNK/TPA Contraindications</h3>
            
            {/* Patient History Section */}
            <div className="mb-4">
              <h4 className="font-medium text-base mb-2">Patient History</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="strokeOrTrauma3m"
                    checked={contraindications.strokeOrTrauma3m}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      strokeOrTrauma3m: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="strokeOrTrauma3m">
                    Ischemic stroke or severe head trauma in the previous three months
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="previousICH"
                    checked={contraindications.previousICH}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      previousICH: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="previousICH">
                    Previous intracranial hemorrhage
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="intracranialNeoplasm"
                    checked={contraindications.intracranialNeoplasm}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      intracranialNeoplasm: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="intracranialNeoplasm">
                    Intra-axial intracranial neoplasm
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="giMalignancy"
                    checked={contraindications.giMalignancy}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      giMalignancy: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="giMalignancy">
                    Gastrointestinal malignancy
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="giHemorrhage21d"
                    checked={contraindications.giHemorrhage21d}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      giHemorrhage21d: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="giHemorrhage21d">
                    Gastrointestinal hemorrhage in the previous 21 days
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="cranialSurgery3m"
                    checked={contraindications.cranialSurgery3m}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      cranialSurgery3m: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="cranialSurgery3m">
                    Intracranial or intraspinal surgery within the prior three months
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Clinical Section */}
            <div className="mb-4">
              <h4 className="font-medium text-base mb-2">Clinical</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="elevatedBP"
                    checked={contraindications.elevatedBP}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      elevatedBP: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="elevatedBP">
                    Persistent blood pressure elevation (systolic ≥185 mmHg or diastolic ≥110 mmHg)
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="activeInternalBleeding"
                    checked={contraindications.activeInternalBleeding}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      activeInternalBleeding: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="activeInternalBleeding">
                    Active internal bleeding
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="infectiveEndocarditis"
                    checked={contraindications.infectiveEndocarditis}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      infectiveEndocarditis: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="infectiveEndocarditis">
                    Presentation consistent with infective endocarditis
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="aorticDissection"
                    checked={contraindications.aorticDissection}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      aorticDissection: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="aorticDissection">
                    Stroke known or suspected to be associated with aortic arch dissection
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Hematologic Section */}
            <div className="mb-4">
              <h4 className="font-medium text-base mb-2">Hematologic</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="plateletUnder100k"
                    checked={contraindications.plateletUnder100k}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      plateletUnder100k: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="plateletUnder100k">
                    Platelet count &lt;100,000/mm³
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="anticoagulantWithElevatedINR"
                    checked={contraindications.anticoagulantWithElevatedINR}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      anticoagulantWithElevatedINR: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="anticoagulantWithElevatedINR">
                    Current anticoagulant use with an INR &gt;1.7 or PT &gt;15 seconds or aPTT &gt;40 seconds
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="lmwhPast24h"
                    checked={contraindications.lmwhPast24h}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      lmwhPast24h: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="lmwhPast24h">
                    Therapeutic doses of LMWH received within 24 hours
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="doac48h"
                    checked={contraindications.doac48h}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      doac48h: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="doac48h">
                    Current use of direct thrombin/factor Xa inhibitor within 48 hours
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Head CT Section */}
            <div className="mb-4">
              <h4 className="font-medium text-base mb-2">Head CT</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="evidenceOfHemorrhage"
                    checked={contraindications.evidenceOfHemorrhage}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      evidenceOfHemorrhage: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="evidenceOfHemorrhage">
                    Evidence of hemorrhage
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="extensiveHypodensity"
                    checked={contraindications.extensiveHypodensity}
                    onChange={(e) => setContraindications({
                      ...contraindications,
                      extensiveHypodensity: e.target.checked
                    })}
                    className="h-4 w-4 mt-1"
                  />
                  <Label htmlFor="extensiveHypodensity">
                    Extensive regions of obvious hypodensity consistent with irreversible injury
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* mRS Section */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Modified Rankin Scale</h3>
            <div className="space-y-2">
              <Label htmlFor="mrs">Pre-treatment mRS Score</Label>
              <Select
                id="mrs"
                value={mrsScore}
                options={mrsOptions}
                onChange={(e) => setMrsScore(e.target.value)}
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
              <div className="flex justify-end mb-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMessage);
                    alert('Message copied to clipboard!');
                  }}
                  className="text-xs"
                >
                  Copy to Clipboard
                </Button>
              </div>
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