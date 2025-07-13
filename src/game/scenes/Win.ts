import { GameTimer } from '../../constants';

export class Win extends Phaser.Scene {
    constructor() {
        super('Win');
    }

    create(): void {
        this.cameras.main.setBackgroundColor('#0c0c22');

        const totalTime = GameTimer.getElapsedTime?.();
        const formattedTime = typeof totalTime === 'number' && !isNaN(totalTime)
            ? totalTime.toFixed(2)
            : 'Unknown';

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // ✨ VFX: Background particles (same as Credits.ts)
        this.add.graphics()
            .fillStyle(0xffffff)
            .fillCircle(2, 2, 2)
            .generateTexture('credit_dot', 4, 4)
            .destroy();

        this.add.particles(0, 0, 'credit_dot', {
            speedY: { min: 10, max: 30 },
            lifespan: 3000,
            alpha: { start: 0.4, end: 0 },
            scale: { start: 0.4, end: 0 },
            quantity: 2,
            blendMode: 'ADD',
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, width, height),
                quantity: 20
            }
        });

        // 🏆 Win Text
        const winText = this.add.text(this.cameras.main.centerX, 140, '🎉 YOU WIN! 🎉', {
            fontSize: '72px',
            fontFamily: 'Comic Sans MS',
            color: '#ffe066',
            stroke: '#ff00ff',
            strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0);

        winText.setShadow(4, 4, '#000000', 6);
        winText.setBlendMode(Phaser.BlendModes.SCREEN);

        this.tweens.add({
            targets: winText,
            alpha: 1,
            scale: { from: 0.7, to: 1 },
            ease: 'Back.easeOut',
            duration: 800
        });

        this.tweens.add({
            targets: winText,
            y: '+=10',
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ⏱️ Time Display
        const timeText = this.add.text(this.cameras.main.centerX, 250, `⏱️ Time: ${formattedTime} seconds`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#00e0ff',
            stroke: '#000000',
            strokeThickness: 4,
            backgroundColor: '#00000066',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setAlpha(0).setY(300);

        this.tweens.add({
            targets: timeText,
            y: 250,
            alpha: 1,
            delay: 600,
            ease: 'Cubic.easeOut',
            duration: 600
        });

        // 💬 Share Prompt
        const sharePrompt = this.add.text(this.cameras.main.centerX, 410, '💬 Please do screenshot & share your time with us in the comments!', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffff99',
            stroke: '#000000',
            strokeThickness: 3,
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: sharePrompt,
            alpha: 1,
            delay: 1000,
            duration: 600,
            ease: 'Sine.easeInOut'
        });

        // 🔘 Back to Menu Button
        const menuButton = this.add.text(this.cameras.main.centerX, 340, '↩ Back to Menu', {
            fontSize: '28px',
            fontFamily: 'Verdana',
            color: '#ffffff',
            backgroundColor: '#ff66cc',
            padding: { x: 16, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuButton.setShadow(2, 2, '#000000', 4);

        menuButton.on('pointerover', () => {
            this.tweens.add({ targets: menuButton, scale: 1.1, duration: 150, ease: 'Power2' });
        });

        menuButton.on('pointerout', () => {
            this.tweens.add({ targets: menuButton, scale: 1.0, duration: 150, ease: 'Power2' });
        });

        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // 🎬 Flash for style
        this.cameras.main.flash(500, 255, 255, 255);
    }
}
