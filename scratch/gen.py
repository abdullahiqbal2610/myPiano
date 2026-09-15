import json

melodies = {
    "ode_to_joy": {
        "name": "Ode to Joy (Beethoven)",
        "notes": [
            {"note": "E4", "duration": 500}, {"note": "E4", "duration": 500}, {"note": "F4", "duration": 500}, {"note": "G4", "duration": 500},
            {"note": "comma"},
            {"note": "G4", "duration": 500}, {"note": "F4", "duration": 500}, {"note": "E4", "duration": 500}, {"note": "D4", "duration": 500},
            {"note": "comma"},
            {"note": "C4", "duration": 500}, {"note": "C4", "duration": 500}, {"note": "D4", "duration": 500}, {"note": "E4", "duration": 500},
            {"note": "comma"},
            {"note": "E4", "duration": 750}, {"note": "D4", "duration": 250}, {"note": "D4", "duration": 1000}
        ]
    },
    "twinkle": {
        "name": "Twinkle Twinkle Little Star",
        "notes": [
            {"note": "C4", "duration": 500}, {"note": "C4", "duration": 500}, {"note": "G4", "duration": 500}, {"note": "G4", "duration": 500},
            {"note": "A4", "duration": 500}, {"note": "A4", "duration": 500}, {"note": "G4", "duration": 1000},
            {"note": "comma"},
            {"note": "F4", "duration": 500}, {"note": "F4", "duration": 500}, {"note": "E4", "duration": 500}, {"note": "E4", "duration": 500},
            {"note": "D4", "duration": 500}, {"note": "D4", "duration": 500}, {"note": "C4", "duration": 1000}
        ]
    },
    "happy_birthday": {
        "name": "Happy Birthday",
        "notes": [
            {"note": "C4", "duration": 400}, {"note": "C4", "duration": 200}, {"note": "D4", "duration": 600}, {"note": "C4", "duration": 600},
            {"note": "F4", "duration": 600}, {"note": "E4", "duration": 1200},
            {"note": "comma"},
            {"note": "C4", "duration": 400}, {"note": "C4", "duration": 200}, {"note": "D4", "duration": 600}, {"note": "C4", "duration": 600},
            {"note": "G4", "duration": 600}, {"note": "F4", "duration": 1200},
            {"note": "comma"},
            {"note": "C4", "duration": 400}, {"note": "C4", "duration": 200}, {"note": "C5", "duration": 600}, {"note": "A4", "duration": 600},
            {"note": "F4", "duration": 600}, {"note": "E4", "duration": 600}, {"note": "D4", "duration": 1200}
        ]
    },
    "kal_ho_naa_ho": {
        "name": "Kal Ho Naa Ho (Title Track)",
        "notes": [
            {"note": "E4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "B4", "duration": 400}, {"note": "A4", "duration": 1000},
            {"note": "comma"},
            {"note": "G4", "duration": 400}, {"note": "F#4", "duration": 400}, {"note": "E4", "duration": 1000},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "B4", "duration": 400}, {"note": "D5", "duration": 800},
            {"note": "C5", "duration": 800}
        ]
    },
    "star_wars": {
        "name": "Star Wars Theme",
        "notes": [
            {"note": "D4", "duration": 300}, {"note": "D4", "duration": 300}, {"note": "D4", "duration": 300},
            {"note": "G4", "duration": 1200}, {"note": "D5", "duration": 1200},
            {"note": "comma"},
            {"note": "C5", "duration": 300}, {"note": "B4", "duration": 300}, {"note": "A4", "duration": 300},
            {"note": "G5", "duration": 1200}, {"note": "D5", "duration": 800},
            {"note": "comma"},
            {"note": "C5", "duration": 300}, {"note": "B4", "duration": 300}, {"note": "A4", "duration": 300},
            {"note": "G5", "duration": 1200}, {"note": "D5", "duration": 800}
        ]
    },
    "harry_potter": {
        "name": "Harry Potter (Hedwig's Theme)",
        "notes": [
            {"note": "B4", "duration": 500}, 
            {"note": "E5", "duration": 800}, {"note": "G5", "duration": 300}, {"note": "F#5", "duration": 500},
            {"note": "E5", "duration": 1000}, {"note": "B5", "duration": 500},
            {"note": "comma"},
            {"note": "A5", "duration": 1200}, {"note": "F#5", "duration": 1000},
            {"note": "comma"},
            {"note": "E5", "duration": 800}, {"note": "G5", "duration": 300}, {"note": "F#5", "duration": 500},
            {"note": "D#5", "duration": 1000}, {"note": "F5", "duration": 500}, {"note": "B4", "duration": 1500}
        ]
    },
    "tum_hi_ho": {
        "name": "Tum Hi Ho (Aashiqui 2)",
        "notes": [
            {"note": "C5", "duration": 400}, {"note": "D5", "duration": 400}, {"note": "D#5", "duration": 800},
            {"note": "comma"},
            {"note": "D5", "duration": 400}, {"note": "C5", "duration": 400}, {"note": "D5", "duration": 800},
            {"note": "comma"},
            {"note": "G4", "duration": 800}, {"note": "C5", "duration": 400}, {"note": "D5", "duration": 400}, {"note": "D#5", "duration": 1000}
        ]
    },
    "tujh_mein_rab": {
        "name": "Tujh Mein Rab Dikhta Hai",
        "notes": [
            {"note": "E4", "duration": 300}, {"note": "F#4", "duration": 300}, {"note": "G4", "duration": 600}, {"note": "A4", "duration": 600},
            {"note": "B4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "F#4", "duration": 800},
            {"note": "comma"},
            {"note": "D4", "duration": 300}, {"note": "E4", "duration": 300}, {"note": "F#4", "duration": 600}, {"note": "G4", "duration": 600},
            {"note": "A4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "F#4", "duration": 400}, {"note": "E4", "duration": 800}
        ]
    },
    "pehla_nasha": {
        "name": "Pehla Nasha",
        "notes": [
            {"note": "C5", "duration": 600}, {"note": "C5", "duration": 600}, {"note": "B4", "duration": 600}, {"note": "A4", "duration": 1200},
            {"note": "comma"},
            {"note": "G4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "B4", "duration": 800}, {"note": "A4", "duration": 1200},
            {"note": "comma"},
            {"note": "F4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 800}, {"note": "G4", "duration": 1200}
        ]
    },
    "kuch_kuch_hota_hai": {
        "name": "Kuch Kuch Hota Hai",
        "notes": [
            {"note": "A4", "duration": 800}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "C5", "duration": 800},
            {"note": "comma"},
            {"note": "B4", "duration": 800}, {"note": "A4", "duration": 400}, {"note": "G4", "duration": 800},
            {"note": "comma"},
            {"note": "F4", "duration": 400}, {"note": "G4", "duration": 800}, {"note": "A4", "duration": 800}
        ]
    },
    "chura_ke_dil_mera": {
        "name": "Chura Ke Dil Mera",
        "notes": [
            {"note": "E4", "duration": 400}, {"note": "F#4", "duration": 400}, {"note": "G4", "duration": 800}, {"note": "A4", "duration": 800},
            {"note": "B4", "duration": 1200},
            {"note": "comma"},
            {"note": "A4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "F#4", "duration": 800}, {"note": "E4", "duration": 1200}
        ]
    },
    "kabhi_kabhie": {
        "name": "Kabhi Kabhie Aditi",
        "notes": [
            {"note": "G4", "duration": 300}, {"note": "A4", "duration": 300}, {"note": "B4", "duration": 300}, {"note": "B4", "duration": 300},
            {"note": "B4", "duration": 600}, {"note": "A4", "duration": 300}, {"note": "G4", "duration": 300},
            {"note": "comma"},
            {"note": "F#4", "duration": 300}, {"note": "G4", "duration": 300}, {"note": "A4", "duration": 600}, {"note": "G4", "duration": 800}
        ]
    },
    "dil_diyan_gallan": {
        "name": "Dil Diyan Gallan",
        "notes": [
            {"note": "E4", "duration": 600}, {"note": "G4", "duration": 600}, {"note": "B4", "duration": 600}, {"note": "A4", "duration": 600},
            {"note": "G4", "duration": 400}, {"note": "F#4", "duration": 400}, {"note": "E4", "duration": 800},
            {"note": "comma"},
            {"note": "D4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "F#4", "duration": 800}, {"note": "G4", "duration": 1200}
        ]
    },
    "teri_meri": {
        "name": "Teri Meri (Bodyguard)",
        "notes": [
            {"note": "A4", "duration": 600}, {"note": "B4", "duration": 600}, {"note": "C5", "duration": 800},
            {"note": "comma"},
            {"note": "B4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "G4", "duration": 800},
            {"note": "comma"},
            {"note": "F#4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 800}, {"note": "E4", "duration": 1200}
        ]
    },
    "my_heart_will_go_on": {
        "name": "My Heart Will Go On (Titanic)",
        "notes": [
            {"note": "F4", "duration": 600}, {"note": "F4", "duration": 600}, {"note": "F4", "duration": 600}, {"note": "F4", "duration": 600},
            {"note": "E4", "duration": 400}, {"note": "F4", "duration": 800},
            {"note": "comma"},
            {"note": "F4", "duration": 600}, {"note": "E4", "duration": 600}, {"note": "F4", "duration": 800}, {"note": "G4", "duration": 800},
            {"note": "A4", "duration": 1200}, {"note": "G4", "duration": 800}
        ]
    },
    "let_it_be": {
        "name": "Let It Be (The Beatles)",
        "notes": [
            {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 400},
            {"note": "E4", "duration": 800},
            {"note": "comma"},
            {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "D4", "duration": 400},
            {"note": "C4", "duration": 800}
        ]
    },
    "hallelujah": {
        "name": "Hallelujah",
        "notes": [
            {"note": "E4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400},
            {"note": "A4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "A4", "duration": 800},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400},
            {"note": "A4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "A4", "duration": 800}
        ]
    },
    "perfect": {
        "name": "Perfect (Ed Sheeran)",
        "notes": [
            {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 800},
            {"note": "B4", "duration": 800},
            {"note": "comma"},
            {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 800},
            {"note": "E4", "duration": 1200}
        ]
    },
    "fur_elise": {
        "name": "Für Elise",
        "notes": [
            {"note": "E5", "duration": 300}, {"note": "D#5", "duration": 300}, {"note": "E5", "duration": 300}, {"note": "D#5", "duration": 300},
            {"note": "E5", "duration": 300}, {"note": "B4", "duration": 300}, {"note": "D5", "duration": 300}, {"note": "C5", "duration": 300},
            {"note": "A4", "duration": 800}
        ]
    },
    "mary_had_a_little_lamb": {
        "name": "Mary Had a Little Lamb",
        "notes": [
            {"note": "E4", "duration": 400}, {"note": "D4", "duration": 400}, {"note": "C4", "duration": 400}, {"note": "D4", "duration": 400},
            {"note": "E4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "E4", "duration": 800},
            {"note": "comma"},
            {"note": "D4", "duration": 400}, {"note": "D4", "duration": 400}, {"note": "D4", "duration": 800},
            {"note": "E4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "G4", "duration": 800}
        ]
    },
    "row_boat": {
        "name": "Row, Row, Row Your Boat",
        "notes": [
            {"note": "C4", "duration": 600}, {"note": "C4", "duration": 600}, {"note": "C4", "duration": 400}, {"note": "D4", "duration": 200}, {"note": "E4", "duration": 600},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "D4", "duration": 200}, {"note": "E4", "duration": 400}, {"note": "F4", "duration": 200}, {"note": "G4", "duration": 1200}
        ]
    },
    "london_bridge": {
        "name": "London Bridge is Falling Down",
        "notes": [
            {"note": "G4", "duration": 400}, {"note": "A4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "F4", "duration": 400},
            {"note": "E4", "duration": 400}, {"note": "F4", "duration": 400}, {"note": "G4", "duration": 800},
            {"note": "comma"},
            {"note": "D4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "F4", "duration": 800},
            {"note": "E4", "duration": 400}, {"note": "F4", "duration": 400}, {"note": "G4", "duration": 800}
        ]
    },
    "frere_jacques": {
        "name": "Frère Jacques",
        "notes": [
            {"note": "C4", "duration": 400}, {"note": "D4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "C4", "duration": 400},
            {"note": "comma"},
            {"note": "C4", "duration": 400}, {"note": "D4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "C4", "duration": 400},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "F4", "duration": 400}, {"note": "G4", "duration": 800},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "F4", "duration": 400}, {"note": "G4", "duration": 800}
        ]
    },
    "amazing_grace": {
        "name": "Amazing Grace",
        "notes": [
            {"note": "G4", "duration": 400}, {"note": "C5", "duration": 800}, {"note": "E5", "duration": 200}, {"note": "C5", "duration": 200},
            {"note": "E5", "duration": 800}, {"note": "D5", "duration": 400},
            {"note": "C5", "duration": 800}, {"note": "A4", "duration": 400}, {"note": "G4", "duration": 1200}
        ]
    },
    "jingle_bells": {
        "name": "Jingle Bells",
        "notes": [
            {"note": "E4", "duration": 300}, {"note": "E4", "duration": 300}, {"note": "E4", "duration": 600},
            {"note": "comma"},
            {"note": "E4", "duration": 300}, {"note": "E4", "duration": 300}, {"note": "E4", "duration": 600},
            {"note": "comma"},
            {"note": "E4", "duration": 300}, {"note": "G4", "duration": 300}, {"note": "C4", "duration": 400}, {"note": "D4", "duration": 200}, {"note": "E4", "duration": 800}
        ]
    },
    "auld_lang_syne": {
        "name": "Auld Lang Syne",
        "notes": [
            {"note": "C4", "duration": 400}, {"note": "F4", "duration": 600}, {"note": "F4", "duration": 200}, {"note": "F4", "duration": 400}, {"note": "A4", "duration": 400},
            {"note": "G4", "duration": 600}, {"note": "F4", "duration": 200}, {"note": "G4", "duration": 400}, {"note": "A4", "duration": 400}
        ]
    },
    "brahms_lullaby": {
        "name": "Brahms' Lullaby",
        "notes": [
            {"note": "E4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "G4", "duration": 800},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "E4", "duration": 400}, {"note": "G4", "duration": 800},
            {"note": "comma"},
            {"note": "E4", "duration": 400}, {"note": "G4", "duration": 400}, {"note": "C5", "duration": 800}, {"note": "B4", "duration": 400}, {"note": "A4", "duration": 400},
            {"note": "A4", "duration": 400}, {"note": "G4", "duration": 800}
        ]
    },
    "joy_to_the_world": {
        "name": "Joy to the World",
        "notes": [
            {"note": "C5", "duration": 800}, {"note": "B4", "duration": 600}, {"note": "A4", "duration": 200},
            {"note": "G4", "duration": 1200}, {"note": "F4", "duration": 400},
            {"note": "E4", "duration": 800}, {"note": "D4", "duration": 800},
            {"note": "C4", "duration": 1600}
        ]
    },
    "oh_susanna": {
        "name": "Oh! Susanna",
        "notes": [
            {"note": "C4", "duration": 400}, {"note": "D4", "duration": 400}, {"note": "E4", "duration": 800}, {"note": "G4", "duration": 800},
            {"note": "G4", "duration": 800}, {"note": "A4", "duration": 800}, {"note": "G4", "duration": 400}, {"note": "E4", "duration": 400}
        ]
    },
    "mario_theme": {
        "name": "Super Mario Bros Theme",
        "notes": [
            {"note": "E5", "duration": 200}, {"note": "E5", "duration": 200}, {"note": "comma"}, {"note": "E5", "duration": 200},
            {"note": "comma"}, {"note": "C5", "duration": 200}, {"note": "E5", "duration": 400},
            {"note": "comma"}, {"note": "G5", "duration": 400}, {"note": "comma"}, {"note": "G4", "duration": 400}
        ]
    }
}

with open("app.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the melodies object without re.sub to avoid bad escapes
start_idx = content.find("const melodies = {")
end_idx = content.find("};", start_idx) + 2

js_obj = "const melodies = " + json.dumps(melodies, indent=4) + ";"
new_content = content[:start_idx] + js_obj + content[end_idx:]

with open("app.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print('Successfully injected 30 melodies into app.js')
