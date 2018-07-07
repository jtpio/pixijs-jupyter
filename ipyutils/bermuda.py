from random import sample
from ipywidgets import DOMWidget, Button, ToggleButton, IntSlider, FloatSlider, VBox, Layout, Box, jslink
from traitlets import Unicode, Bool, Int, List, Tuple, default, validate
from ._version import EXTENSION_SPEC_VERSION

module_name = "jupyter-plot-utils"

N_TRIANGLES = 16
IDS = list(range(N_TRIANGLES))
N_COLORS = 6
WHITE, BLUE, YELLOW, GREEN, BLACK, RED = range(N_COLORS)

triangles_count = [
    (WHITE, BLUE, BLUE, 1),
    (WHITE, YELLOW, GREEN, 2),
    (WHITE, BLACK, BLUE, 2),
    (WHITE, GREEN, RED, 1),
    (WHITE, RED, YELLOW, 1),
    (WHITE, WHITE, BLUE, 1),
    (BLACK, GREEN, RED, 1),
    (BLACK, RED, GREEN, 2),
    (BLACK, BLACK, GREEN, 1),
    (BLACK, GREEN, YELLOW, 1),
    (BLACK, YELLOW, BLUE, 1),
    (GREEN, RED, YELLOW, 1),
    (BLUE, GREEN, YELLOW, 1)
]

triangles = tuple([t[:-1] for t in triangles_count for times in range(t[-1])])


class BermudaTriangle(DOMWidget):
    _model_name = Unicode('BermudaTriangleModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)
    _view_name = Unicode('BermudaTriangleView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(EXTENSION_SPEC_VERSION).tag(sync=True)

    N_TRIANGLES = N_TRIANGLES
    TRIANGLES = List(triangles).tag(sync=True)
    LEFT = Tuple((WHITE, RED, WHITE, YELLOW)).tag(sync=True)
    RIGHT = Tuple((BLUE, RED, GREEN, BLACK)).tag(sync=True)
    BOTTOM = Tuple((GREEN, GREEN, WHITE, GREEN)).tag(sync=True)

    positions = List().tag(sync=True)
    permutation = List([]).tag(sync=True)
    states = List([]).tag(sync=True)

    title = Unicode('').tag(sync=True)
    running = Bool(False).tag(sync=True)
    frame = Int(0).tag(sync=True)
    speed = Int(1).tag(sync=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.layout.display = 'flex'
        self.board = []

    @default('positions')
    def _default_positions(self):
        triangle_id, positions = 0, []
        for row in range(4):
            n_row = 2 * row + 1
            for col in range(n_row):
                flip = (triangle_id + row) % 2
                positions.append({
                    'id': triangle_id,
                    'flip': flip,
                    'row': row,
                    'col': col,
                    'n_row': n_row
                })
                triangle_id += 1
        return positions
    
    @default('permutation')
    def _default_permutation(self):
        # list of (triangle_id, color_id)
        return [[i, 0] for i in range(N_TRIANGLES)]

    def shuffle(self):
        self.permutation = sample(self.permutation, N_TRIANGLES)
    
    def next_frame(self):
        self.frame = min(self.frame + 1, len(self.states))
        
    def prev_frame(self):
        self.frame = max(0, self.frame - 1)

    def start_frame(self):
        self.frame = 0

    def end_frame(self):
        self.frame = len(self.states) - 1

    def is_valid(self, i):
        '''
        Parameters
        ----------

        i: int
            Position of the triangle to check, between 0 and 15 (inclusive)

        Returns
        -------
        valid: bool
            True if the triangle at position i doesn't have any conflict
            False otherwise
        '''
        ts = self.TRIANGLES
        permutation, positions = self.board, self.positions[i]
        row, col, n_col = positions['row'], positions['col'], positions['n_row']
        triangle_id, triangle_rotation = permutation[i]
            
        # on the left edge
        if col == 0 and ts[triangle_id][2-triangle_rotation] != self.LEFT[row]:
            return False

        # on the right edge
        if col == n_col - 1 and ts[triangle_id][1-triangle_rotation] != self.RIGHT[row]:
            return False

        # on the bottom edge
        if row == 3 and col % 2 == 0 and ts[triangle_id][0-triangle_rotation] != self.BOTTOM[col//2]:
            return False
        
        if col > 0:
            left_pos = i - 1
            left_triangle_id, left_triangle_rotation = permutation[left_pos]

            # normal orientation (facing up)
            if col % 2 == 0 and ts[triangle_id][2-triangle_rotation] != ts[left_triangle_id][2-left_triangle_rotation]:
                return False

            if col % 2 == 1:
                # reverse orientation (facing down)
                # match with left triangle
                if ts[triangle_id][1-triangle_rotation] != ts[left_triangle_id][1-left_triangle_rotation]:
                    return False
                
                # match with line above
                above_pos = i - (n_col - 1)
                above_triangle_id, above_triangle_rotation = permutation[above_pos]
                if ts[triangle_id][0-triangle_rotation] != ts[above_triangle_id][0-above_triangle_rotation]:
                    return False

        return True
        

class TriangleAnimation(VBox):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.bermuda = BermudaTriangle()
        iteration_slider = IntSlider(min=0, max=0, step=1, description='Iteration', layout=Layout(width='100%'), continuous_update=False)
        speed_slider = IntSlider(min=1, max=100, step=1, value=50, description='Speed', readout=False)
        prev_button = Button(description='◄ Previous', button_style='info')
        next_button = Button(description='Next ►', button_style='info')
        start_button = Button(description='◄◄  Start', button_style='info')
        end_button = Button(description='End ►►', button_style='info')
        play_button = ToggleButton(description='Play / Pause', button_style='success', value=False)

        jslink((play_button, 'value'), (self.bermuda, 'running'))
        jslink((iteration_slider, 'value'), (self.bermuda, 'frame'))
        jslink((speed_slider, 'value'), (self.bermuda, 'speed'))

        # adapt iteration slider whenever the states change
        def on_states_changed(change):
            states = change['new']
            n_states = len(states)
            iteration_slider.max = n_states

        def reset_play_button(change):
            play_button.value = False

        self.bermuda.observe(on_states_changed, names='states')
        iteration_slider.observe(reset_play_button, names='value')
        
        def on_click_next(b):
            self.bermuda.next_frame()

        def on_click_prev(b):
            self.bermuda.prev_frame()

        def on_click_start(b):
            self.bermuda.start_frame()

        def on_click_end(b):
            self.bermuda.end_frame()

        next_button.on_click(on_click_next)
        prev_button.on_click(on_click_prev)
        start_button.on_click(on_click_start)
        end_button.on_click(on_click_end)

        box_layout = Layout(display='flex', flex_flow='row', align_items='flex-start', width='100%')
        items = [play_button, start_button, prev_button, next_button, end_button, speed_slider]
        self.children = [
            Box(children=items, layout=box_layout), 
            Box(children=(iteration_slider,), layout=box_layout),
            self.bermuda
        ] 
